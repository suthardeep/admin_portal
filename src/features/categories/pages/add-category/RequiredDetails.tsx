import React, { useState } from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';




interface Child {
  id: number;
  name: string;
}

interface Parent {
  id: number;
  name: string;
  children: Child[];
}

interface Section {
  title: string;
  parents: Parent[];
}

// Parent with Children Component
const ParentSection: React.FC<{
  parent: Parent;
  sectionIndex: number;
  sectionTitle: string;
  onUpdateParent: (sectionIndex: number, parentId: number, value: string) => void;
  onAddChild: (sectionIndex: number, parentId: number) => void;
  onRemoveChild: (sectionIndex: number, parentId: number, childId: number) => void;
  onUpdateChild: (sectionIndex: number, parentId: number, childId: number, value: string) => void;
}> = ({ parent, sectionIndex, sectionTitle, onUpdateParent, onAddChild, onRemoveChild, onUpdateChild }) => {
  const placeholder = sectionTitle.includes('Document')
    ? 'Enter name of required document'
    : 'Type here';

  return (
    <div className="space-y-4">
      {/* Parent input */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1">
          <Input
            value={parent.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onUpdateParent(sectionIndex, parent.id, e.target.value)
            }
            placeholder={placeholder}
            className="h-[36px] w-full"
          />
        </div>
        {parent.children.length < 2 && (
          <button
            onClick={() => onAddChild(sectionIndex, parent.id)}
            className="flex items-center justify-center text-base-content hover:text-base-content/80 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
            </svg>
          </button>
        )}
      </div>

      {/* Children inputs */}
      {parent.children.length > 0 && (
        <div className="space-y-3">
          {parent.children.map((child) => (
            <div key={child.id} className="flex items-center gap-3 pl-8 w-full">
              <button
                onClick={() => onRemoveChild(sectionIndex, parent.id, child.id)}
                className="flex items-center justify-center text-base-content hover:text-base-content/80 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                </svg>
              </button>
              <div className="flex-1">
                <Input
                  value={child.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdateChild(sectionIndex, parent.id, child.id, e.target.value)
                  }
                  placeholder={placeholder}
                  className="h-[36px] w-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
const RequiredDetails: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      title: 'Required Documents for Vendor',
      parents: [
        {
          id: Date.now(),
          name: '',
          children: []
        }
      ]
    },
    {
      title: 'Mandatory Fields to create a Product',
      parents: [
        {
          id: Date.now() + 1,
          name: '',
          children: []
        }
      ]
    }
  ]);

  const addParent = (sectionIndex: number): void => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[sectionIndex].parents.push({
        id: Date.now(),
        name: '',
        children: []
      });
      return newSections;
    });
  };

  const updateParent = (sectionIndex: number, parentId: number, value: string): void => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[sectionIndex].parents = newSections[sectionIndex].parents.map(p =>
        p.id === parentId ? { ...p, name: value } : p
      );
      return newSections;
    });
  };

  const addChild = (sectionIndex: number, parentId: number): void => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[sectionIndex].parents = newSections[sectionIndex].parents.map(p =>
        p.id === parentId && p.children.length < 2
          ? { 
              ...p, 
              children: [...p.children, { id: Date.now(), name: '' }]
            }
          : p
      );
      return newSections;
    });
  };

  const removeChild = (sectionIndex: number, parentId: number, childId: number): void => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[sectionIndex].parents = newSections[sectionIndex].parents.map(p =>
        p.id === parentId
          ? { ...p, children: p.children.filter(c => c.id !== childId) }
          : p
      );
      return newSections;
    });
  };

  const updateChild = (sectionIndex: number, parentId: number, childId: number, value: string): void => {
    setSections(prev => {
      const newSections = [...prev];
      newSections[sectionIndex].parents = newSections[sectionIndex].parents.map(p =>
        p.id === parentId
          ? {
              ...p,
              children: p.children.map(c => (c.id === childId ? { ...c, name: value } : c))
            }
          : p
      );
      return newSections;
    });
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl rounded-xl bg-base-1 p-2">
        <div className="p-4 border-b border-body-content/50">
          <h1 className="text-lg font-semibold text-base-content">Required Details</h1>
        </div>

        <div className="p-6 space-y-8">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              <Label className="text-base font-light" required={true}>{section.title}</Label>

              <div className="space-y-6">
                {section.parents.map((parent) => (
                  <ParentSection
                    key={parent.id}
                    parent={parent}
                    sectionIndex={sectionIndex}
                    sectionTitle={section.title}
                    onUpdateParent={updateParent}
                    onAddChild={addChild}
                    onRemoveChild={removeChild}
                    onUpdateChild={updateChild}
                  />
                ))}
              </div>

              {/* Add Parent Button */}
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => addParent(sectionIndex)}
                  className="flex items-center gap-2 text-base-content hover:text-base-content/80"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                  </svg>
                  <span>Add More</span>
                </button>
              </div>

              {sectionIndex < sections.length - 1 && (
                <div className="pt-4 border-t border-body-content/50"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequiredDetails;