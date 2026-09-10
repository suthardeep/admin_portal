import React, { useState, useMemo } from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Button } from '@/components/base/Button';
import Dropdown from '@/components/base/Dropdown';
import ErrorText from '@/components/base/ErrorText';
import Separator from '@/components/base/Separator';
import { Info } from 'lucide-react';

// Types
interface Zone {
  id: string;
  name: string;
}

interface Aisle {
  id: string;
  name: string;
  zoneId: string;
}

interface Bay {
  id: string;
  name: string;
  aisleId: string;
}

interface Level {
  id: string;
  name: string;
  bayId: string;
}

interface SizeDetailsMultiStepProps {
  initialData?: {
    totalSqFt?: number;
    totalZones?: number;
    zones?: Array<{
      name: string;
      aisles: Array<{
        name: string;
        bays: Array<{
          name: string;
          levels: Array<{
            name: string;
          }>;
        }>;
      }>;
    }>;
  };
  onComplete?: (data: {
    size: string;
    totalZone: string;
    zones: Zone[];
    aisles: Aisle[];
    bays: Bay[];
    levels: Level[];
  }) => void;
}

const SizeDetailsMultiStep: React.FC<SizeDetailsMultiStepProps> = ({ initialData, onComplete }) => {
  const [size, setSize] = useState<number | ''>('');
  const [totalZone, setTotalZone] = useState<number | ''>('');
  const [isMultiStepActive, setIsMultiStepActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [zones, setZones] = useState<Zone[]>([]);
  const [aisles, setAisles] = useState<Aisle[]>([{ id: 'aisle-1', name: '', zoneId: '' }]);
  const [bays, setBays] = useState<Bay[]>([{ id: 'bay-1', name: '', aisleId: '' }]);
  const [levels, setLevels] = useState<Level[]>([{ id: 'level-1', name: '', bayId: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize component with existing data (for edit mode) - only once
  React.useEffect(() => {
    if (initialData && !isInitialized) {
      // Set basic values
      if (initialData.totalSqFt) {
        setSize(initialData.totalSqFt);
      }
      if (initialData.totalZones) {
        setTotalZone(initialData.totalZones);
      }

      // Convert form zones to component format
      if (initialData.zones && initialData.zones.length > 0) {
        const convertedZones: Zone[] = [];
        const convertedAisles: Aisle[] = [];
        const convertedBays: Bay[] = [];
        const convertedLevels: Level[] = [];

        initialData.zones.forEach((zone, zoneIndex) => {
          const zoneId = `zone-${zoneIndex + 1}`;
          convertedZones.push({ id: zoneId, name: zone.name });

          if (zone.aisles && zone.aisles.length > 0) {
            zone.aisles.forEach((aisle, aisleIndex) => {
              const aisleId = `aisle-${zoneIndex + 1}-${aisleIndex + 1}`;
              convertedAisles.push({ id: aisleId, name: aisle.name, zoneId });

              if (aisle.bays && aisle.bays.length > 0) {
                aisle.bays.forEach((bay, bayIndex) => {
                  const bayId = `bay-${zoneIndex + 1}-${aisleIndex + 1}-${bayIndex + 1}`;
                  convertedBays.push({ id: bayId, name: bay.name, aisleId });

                  if (bay.levels && bay.levels.length > 0) {
                    bay.levels.forEach((level, levelIndex) => {
                      const levelId = `level-${zoneIndex + 1}-${aisleIndex + 1}-${bayIndex + 1}-${levelIndex + 1}`;
                      convertedLevels.push({ id: levelId, name: level.name, bayId });
                    });
                  }
                });
              }
            });
          }
        });

        setZones(convertedZones);
        setAisles(convertedAisles);
        setBays(convertedBays);
        setLevels(convertedLevels);

        // Auto-activate multi-step if we have data
        if (convertedZones.length > 0) {
          setIsMultiStepActive(true);
          setCurrentStep(5); // Go to summary view
        }
      }

      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Auto-activate Zone step when totalZone is entered
  React.useEffect(() => {
    if (totalZone && typeof totalZone === 'number' && totalZone > 0 && size && typeof size === 'number' && size > 0 && !isMultiStepActive) {
      handleStartMultiStep();
    }
  }, [totalZone, size]);

  // Update zones dynamically when totalZone changes (even when multi-step is active)
  React.useEffect(() => {
    if (totalZone && typeof totalZone === 'number' && totalZone > 0 && isMultiStepActive) {
      const newZoneCount = totalZone;
      const currentZoneCount = zones.length;

      if (newZoneCount !== currentZoneCount) {
        if (newZoneCount > currentZoneCount) {
          // Add new zones
          const newZones = Array.from({ length: newZoneCount - currentZoneCount }, (_, i) => ({
            id: `zone-${currentZoneCount + i + 1}`,
            name: ''
          }));
          setZones([...zones, ...newZones]);
        } else {
          // Remove extra zones
          setZones(zones.slice(0, newZoneCount));
        }
      }
    }
  }, [totalZone, isMultiStepActive]);

  const steps = [
    { id: 1, name: 'Zone', isActive: currentStep >= 1 },
    { id: 2, name: 'Aisle', isActive: currentStep >= 2 },
    { id: 3, name: 'Bay', isActive: currentStep >= 3 },
    { id: 4, name: 'Level', isActive: currentStep >= 4 },
  ];

  const handleStartMultiStep = () => {
    const newErrors: Record<string, string> = {};
    if (!size || typeof size !== 'number' || size <= 0) newErrors.size = 'Size is required';
    if (!totalZone || typeof totalZone !== 'number' || totalZone <= 0) newErrors.totalZone = 'Total zone must be greater than 0';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsMultiStepActive(true);
    setCurrentStep(1);
    // Type guard ensures totalZone is number here
    if (typeof totalZone === 'number') {
      const initialZones = Array.from({ length: totalZone }, (_, i) => ({ id: `zone-${i + 1}`, name: '' }));
      setZones(initialZones);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId === 1 && !isMultiStepActive) {
      handleStartMultiStep();
      return;
    }
    if (isMultiStepActive) setCurrentStep(stepId);
  };

  const handleZoneNameChange = (index: number, value: string) => {
    const updated = [...zones];
    updated[index].name = value;
    setZones(updated);
  };

  const handleAisleNameChange = (index: number, value: string) => {
    const updated = [...aisles];
    updated[index].name = value;
    setAisles(updated);
  };

  const handleAisleZoneChange = (index: number, zoneId: string | number) => {
    const updated = [...aisles];
    updated[index].zoneId = String(zoneId);
    setAisles(updated);
  };

  const handleAddAisle = () => {
    setAisles([...aisles, { id: `aisle-${Date.now()}`, name: '', zoneId: '' }]);
  };

  const handleRemoveAisle = (index: number) => {
    if (aisles.length > 1) setAisles(aisles.filter((_, i) => i !== index));
  };

  const handleBayNameChange = (index: number, value: string) => {
    const updated = [...bays];
    updated[index].name = value;
    setBays(updated);
  };

  const handleBayAisleChange = (index: number, aisleId: string | number) => {
    const updated = [...bays];
    updated[index].aisleId = String(aisleId);
    setBays(updated);
  };

  const handleAddBay = () => {
    setBays([...bays, { id: `bay-${Date.now()}`, name: '', aisleId: '' }]);
  };

  const handleRemoveBay = (index: number) => {
    if (bays.length > 1) setBays(bays.filter((_, i) => i !== index));
  };

  const handleLevelNameChange = (index: number, value: string) => {
    const updated = [...levels];
    updated[index].name = value;
    setLevels(updated);
  };

  const handleLevelBayChange = (index: number, bayId: string | number) => {
    const updated = [...levels];
    updated[index].bayId = String(bayId);
    setLevels(updated);
  };

  const handleAddLevel = () => {
    setLevels([...levels, { id: `level-${Date.now()}`, name: '', bayId: '' }]);
  };

  const handleRemoveLevel = (index: number) => {
    if (levels.length > 1) setLevels(levels.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const stepErrors: Record<string, string> = {};
    if (currentStep === 1) {
      zones.forEach((zone, index) => {
        if (!zone.name.trim()) stepErrors[`zone-${index}`] = 'Zone name is required';
      });
    } else if (currentStep === 2) {
      aisles.forEach((aisle, index) => {
        if (!aisle.name.trim()) stepErrors[`aisle-name-${index}`] = 'Aisle name is required';
        if (!aisle.zoneId) stepErrors[`aisle-zone-${index}`] = 'Zone selection is required';
      });
    } else if (currentStep === 3) {
      bays.forEach((bay, index) => {
        if (!bay.name.trim()) stepErrors[`bay-name-${index}`] = 'Bay name is required';
        if (!bay.aisleId) stepErrors[`bay-aisle-${index}`] = 'Aisle selection is required';
      });
    }
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    // Validate level fields before completing
    const stepErrors: Record<string, string> = {};
    levels.forEach((level, index) => {
      if (!level.name.trim()) stepErrors[`level-name-${index}`] = 'Level name is required';
      if (!level.bayId) stepErrors[`level-bay-${index}`] = 'Bay selection is required';
    });

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    // Move to summary view
    setCurrentStep(5);

    if (onComplete) {
      onComplete({
        size: size === '' ? '' : String(size),
        totalZone: totalZone === '' ? '' : String(totalZone),
        zones,
        aisles,
        bays,
        levels
      });
    }
  };

  const handlePrevious = () => {
    console.log('🔙 Previous clicked, currentStep:', currentStep);
    if (currentStep === 5) {
      // From summary view, go back to the last step (Level)
      console.log('📍 Moving from summary (5) to level (4)');
      setCurrentStep(4);
    } else if (currentStep === 1) {
      // From Zone step, go back to size details (deactivate multi-step)
      console.log('📍 Moving from zone (1) to size details (0)');
      setIsMultiStepActive(false);
      setCurrentStep(0);
    } else if (currentStep > 1) {
      console.log('📍 Moving from step', currentStep, 'to', currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  // Auto-update parent form whenever data changes
  React.useEffect(() => {
    if (onComplete && size !== '' && totalZone !== '') {
      onComplete({
        size: String(size),
        totalZone: String(totalZone),
        zones,
        aisles,
        bays,
        levels
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, totalZone, zones, aisles, bays, levels]);

  const zoneOptions = useMemo(() => {
    return zones.map((zone) => ({ value: zone.id, label: zone.name || 'Unnamed Zone' }));
  }, [zones]);

  const aisleOptions = useMemo(() => {
    return aisles.map((aisle) => ({ value: aisle.id, label: aisle.name || 'Unnamed Aisle' }));
  }, [aisles]);

  const bayOptions = useMemo(() => {
    return bays.map((bay) => ({ value: bay.id, label: bay.name || 'Unnamed Bay' }));
  }, [bays]);

  const getZoneName = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone?.name || '';
  };

  const getAisleDetails = (aisleId: string) => {
    const aisle = aisles.find((a) => a.id === aisleId);
    if (!aisle) return null;
    const zoneName = getZoneName(aisle.zoneId);
    return { name: aisle.name, zoneName };
  };

  const getBayDetails = (bayId: string) => {
    const bay = bays.find((b) => b.id === bayId);
    if (!bay) return null;
    const aisleDetails = getAisleDetails(bay.aisleId);
    return { name: bay.name, aisleDetails };
  };

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="p-4 border-b border-body-content/20">
        <h2 className="text-base font-semibold text-base-content">Size Details</h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Size and Total Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-base font-light" required={true}>Size (Sq.ft)</Label>
            <Input
              type="number"
              value={size === '' ? '' : size}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                if (value === '') {
                  setSize('');
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    setSize(numValue);
                  }
                }
              }}
              placeholder="Enter size"
              disabled={false}
              min="0"
              step="0.01"
              className={`h-[36px] w-full ${errors.size ? 'border-error' : ''}`}
            />
            {errors.size && <ErrorText className="mt-1 !text-error">{errors.size}</ErrorText>}
          </div>

          <div className="space-y-1">
            <Label className="text-base font-light" required={true}>Total Zone</Label>
            <Input
              type="number"
              value={totalZone === '' ? '' : totalZone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                if (value === '') {
                  setTotalZone('');
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    setTotalZone(numValue);
                  }
                }
              }}
              placeholder="Enter total zone"
              disabled={false}
              min="0"
              step="1"
              className={`h-[36px] w-full ${errors.totalZone ? 'border-error' : ''}`}
            />
            {errors.totalZone && <ErrorText className="mt-1 !text-error">{errors.totalZone}</ErrorText>}
          </div>
        </div>

        {/* Breadcrumb Steps */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-4 h-4 rounded-full">
            <Info size={12} className="text-body-content w-full h-full" />
          </div>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                disabled={!isMultiStepActive && step.id !== 1}
                className={`px-3 py-1 rounded-md text-sm font-light transition-colors ${
                  currentStep === step.id ? 'bg-primary-100 text-primary-700' : step.isActive ? 'bg-base-content/10 text-base-content hover:bg-base-300/80' : 'bg-base-content/10 text-base-content/90 cursor-not-allowed'
                }`}
              >
                {step.name}
              </button>
              {index < steps.length - 1 && <span className="text-disabled-content text-sm">{'>'}</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {isMultiStepActive && (
          <div className="bg-base-2 rounded-lg p-4 space-y-4">
            {/* Step 1: Zone */}
            {currentStep === 1 && (
              <div className="rounded-lg p-2">
                <div className="space-y-6">
                  {zones.map((zone, index) => (
                    <div key={zone.id} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-4 h-4 border-[2px] border-base-content rounded text-xs font-semibold text-base-content flex-shrink-0 mt-7">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-sm font-light mb-0" required={true}>Zone name</Label>
                        <Input
                          type="text"
                          value={zone.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleZoneNameChange(index, e.target.value)}
                          placeholder="Enter zone name"
                          className={`h-[36px] w-full ${errors[`zone-${index}`] ? 'border-error' : ''}`}
                        />
                        {errors[`zone-${index}`] && <ErrorText className="mt-1 !text-error">{errors[`zone-${index}`]}</ErrorText>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Aisle */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg p-6">
                <div className="space-y-4">
                  {aisles.map((aisle, index) => (
                    <div key={aisle.id} className="flex items-start gap-2">
                      {/* Aisle Input with label above */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <Label className="text-sm font-light text-base-content" required={true}>Aisle name</Label>
                        <Input
                          type="text"
                          value={aisle.name}
                          onChange={(e) => handleAisleNameChange(index, e.target.value)}
                          placeholder="Enter aisle name"
                          className={`h-[36px] w-full ${errors[`aisle-name-${index}`] ? 'border-error' : ''}`}
                        />
                        {errors[`aisle-name-${index}`] && (
                          <ErrorText className="mt-1 !text-error">{errors[`aisle-name-${index}`]}</ErrorText>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex items-end w-[80px] flex-shrink-0 text-center" style={{ height: '57px' }}>
                        <span className="text-sm text-body-content whitespace-nowrap w-full mb-2">aisle is in</span>
                      </div>

                      {/* Zone Dropdown with label above */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <Label className="text-sm font-light text-base-content" required={true}>Select Zone</Label>
                        <Dropdown
                          placeholder="Select zone"
                          options={zoneOptions}
                          value={aisle.zoneId || null}
                          onChange={(value) => handleAisleZoneChange(index, value)}
                          className={`w-full ${errors[`aisle-zone-${index}`] ? 'border-error' : ''}`}
                        />
                        {errors[`aisle-zone-${index}`] && (
                          <ErrorText className="mt-1 !text-error">{errors[`aisle-zone-${index}`]}</ErrorText>
                        )}
                      </div>

                      {/* Text + Delete Button Container */}
                      <div className="w-[80px] flex-shrink-0 flex items-end gap-2" style={{ height: '57px' }}>
                        <span className="text-sm text-body-content whitespace-nowrap mb-2">zone.</span>

                        {/* Delete Button */}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAisle(index)}
                            className="flex items-center justify-center h-[36px] w-[36px] text-base-content hover:text-error flex-shrink-0 ml-auto mb-[2px]"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add button inside white box, bottom right */}
                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddAisle}
                      startIcon="SquarePlus"
                      startIconClassname="text-secondary w-4 h-4"
                      className="border-secondary hover:bg-base-200 px-2 py-1 h-auto text-sm text-secondary rounded-md"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bay */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg p-6">
                <div className="space-y-4">
                  {bays.map((bay, index) => {
                    const aisleDetails = getAisleDetails(bay.aisleId);
                    return (
                      <div key={bay.id}>
                        {/* Input Row */}
                        <div className="flex items-start gap-2">
                          {/* Bay Name Input with label above */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <Label className="text-sm font-light text-base-content" required={true}>Bay name</Label>
                            <Input
                              type="text"
                              value={bay.name}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleBayNameChange(index, e.target.value)}
                              placeholder="Enter bay name"
                              className={`h-[36px] w-full ${errors[`bay-name-${index}`] ? 'border-error' : ''}`}
                            />
                            {errors[`bay-name-${index}`] && (
                              <ErrorText className="mt-1 !text-error">{errors[`bay-name-${index}`]}</ErrorText>
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex items-end w-[70px] shrink-0 text-center" style={{ height: '57px' }}>
                            <span className="text-sm text-body-content whitespace-nowrap w-full mb-2">bay is in</span>
                          </div>

                          {/* Aisle Dropdown with label above */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <Label className="text-sm font-light text-base-content" required={true}>Select Aisle</Label>
                            <Dropdown
                              placeholder="Select aisle"
                              options={aisleOptions}
                              value={bay.aisleId || null}
                              onChange={(value) => handleBayAisleChange(index, value)}
                              className={`w-full ${errors[`bay-aisle-${index}`] ? 'border-error' : ''}`}
                            />
                            {errors[`bay-aisle-${index}`] && (
                              <ErrorText className="mt-1 !text-error">{errors[`bay-aisle-${index}`]}</ErrorText>
                            )}
                          </div>

                          {/* Text + Delete Button Container */}
                          <div className="w-[100px] shrink-0 flex items-end gap-2" style={{ height: '57px' }}>
                            <span className="text-sm text-body-content whitespace-nowrap mb-2">aisle and</span>

                            {/* Delete Button */}
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBay(index)}
                                className="flex items-center justify-center h-[36px] w-[36px] text-base-content hover:text-error shrink-0 ml-auto mb-0.5"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Description text below */}
                        {bay.aisleId && aisleDetails && aisleDetails.name && (
                          <p className="text-sm text-body-content mt-2 leading-relaxed">
                            <span className="font-semibold text-base-content text-sm">{aisleDetails.name}</span> aisle is in <span className="font-semibold text-base-content text-sm">{aisleDetails.zoneName}</span> zone.
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Add button inside white box, bottom right */}
                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddBay}
                      startIcon="SquarePlus"
                      startIconClassname="text-secondary w-4 h-4"
                      className="border-secondary hover:bg-base-200 px-2 py-1 h-auto text-sm text-secondary rounded-md"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Level */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg p-6">
                <div className="space-y-4">
                  {levels.map((level, index) => {
                    const bayDetails = getBayDetails(level.bayId);
                    return (
                      <div key={level.id}>
                        {/* Input Row */}
                        <div className="flex items-start gap-2">
                          {/* Level Name Input with label above */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <Label className="text-sm font-light text-base-content" required={true}>Level name</Label>
                            <Input
                              type="text"
                              value={level.name}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLevelNameChange(index, e.target.value)}
                              placeholder="Enter level name"
                              className={`h-[36px] w-full ${errors[`level-name-${index}`] ? 'border-error' : ''}`}
                            />
                            {errors[`level-name-${index}`] && (
                              <ErrorText className="mt-1 !text-error">{errors[`level-name-${index}`]}</ErrorText>
                            )}
                          </div>
                          
                          {/* Text */}
                          <div className="flex items-end w-[80px] flex-shrink-0 text-center" style={{ height: '57px' }}>
                            <span className="text-sm text-body-content whitespace-nowrap w-full mb-2">level is in</span>
                          </div>
                          
                          {/* Bay Dropdown with label above */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <Label className="text-sm font-light text-base-content" required={true}>Select Bay</Label>
                            <Dropdown
                              placeholder="Select bay"
                              options={bayOptions}
                              value={level.bayId || null}
                              onChange={(value) => handleLevelBayChange(index, value)}
                              className={`w-full ${errors[`level-bay-${index}`] ? 'border-error' : ''}`}
                            />
                            {errors[`level-bay-${index}`] && (
                              <ErrorText className="mt-1 !text-error">{errors[`level-bay-${index}`]}</ErrorText>
                            )}
                          </div>
                          
                          {/* Text + Delete Button Container */}
                          <div className="w-[80px] flex-shrink-0 flex items-end gap-2" style={{ height: '57px' }}>
                            <span className="text-sm text-body-content whitespace-nowrap mb-2">bay</span>
                            
                            {/* Delete Button */}
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLevel(index)}
                                className="flex items-center justify-center h-[36px] w-[36px] text-base-content hover:text-error flex-shrink-0 ml-auto mb-[2px]"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Description text below */}
                        {level.bayId && bayDetails && bayDetails.name && (
                          <p className="text-sm text-body-content mt-2 leading-relaxed">
                            and <span className="font-semibold text-base-content text-sm">{bayDetails.name}</span> bay is in <span className="font-semibold text-base-content text-sm">{bayDetails.aisleDetails?.name}</span> aisle and <span className="font-semibold text-base-content text-sm">{bayDetails.aisleDetails?.zoneName}</span> zone.
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Add button inside white box, bottom right */}
                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddLevel}
                      startIcon="SquarePlus"
                      startIconClassname="text-secondary w-4 h-4"
                      className="border-secondary hover:bg-base-200 px-2 py-1 h-auto text-sm text-secondary rounded-md"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Summary View */}
            {currentStep === 5 && (
              <div className="rounded-lg p-6">
                <div className="space-y-4">
                  {zones.map((zone, zoneIndex) => {
                    const zoneAisles = aisles.filter(a => a.zoneId === zone.id);
                    const zoneBays = bays.filter(b => zoneAisles.some(a => a.id === b.aisleId));
                    const zoneLevels = levels.filter(l => zoneBays.some(b => b.id === l.bayId));
                    
                    return (
                      <div key={zone.id} className="flex items-center justify-between gap-8 py-3">
                        {/* Left side: Zone number and details */}
                        <div className="flex items-center gap-3">
                          {/* Zone Number */}
                          <div className="flex items-center justify-center w-4 h-4 border-2 border-base-content rounded text-xs font-normal text-base-content shrink-0">
                            {zoneIndex + 1}
                          </div>

                          {/* Zone name and Aisle count */}
                          <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-base-content">{zone.name}</h3>
                            <p className="text-sm font-light text-body-content">
                              {zoneAisles.length} Aisle
                            </p>
                          </div>
                        </div>

                        {/* Right side: Bay and Level counts */}
                        <div className="flex flex-col items-end text-right">
                          <p className="text-sm font-light text-body-content">
                            {zoneBays.length} Bay
                          </p>
                          <p className="text-sm font-light text-body-content">
                            {zoneLevels.length} Level
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons - Outside white box, in base-100 bg */}
            <div className="flex items-center justify-end gap-4 pt-2">
              {/* Show Previous button on all steps except when not started */}
              {currentStep >= 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>Previous</Button>
              )}

              {/* Show appropriate next/complete button */}
              {currentStep === 5 ? (
                // Summary view - no next button needed
                null
              ) : currentStep === 4 ? (
                <Button type="button" variant="filled" color="primary" onClick={handleComplete}>Complete</Button>
              ) : (
                <Button type="button" variant="filled" color="primary" onClick={handleNext}>Next</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeDetailsMultiStep;