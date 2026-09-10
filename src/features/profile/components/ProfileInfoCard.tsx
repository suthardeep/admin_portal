import { cn } from "@/utils/helpers";
import Icon from "@/components/base/Icon";

interface ProfileInfoCardProps {
  label: string;
  value: string;
  type?: 'text' | 'password';
  showToggle?: boolean;
  isPasswordVisible?: boolean;
  onToggle?: () => void;
  className?: string;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  label,
  value,
  type = 'text',
  showToggle = false,
  isPasswordVisible = false,
  onToggle,
  className
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg bg-secondary-50 px-4 py-4 sm:px-6 sm:py-5 transition-all min-w-[160px] sm:min-w-[200px]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <span className="text-base sm:text-lg font-normal text-base-content break-all">
          {type === 'password' && !isPasswordVisible ? '********' : value}
        </span>
        {showToggle && onToggle && (
          <button
            onClick={onToggle}
            className="p-1 text-base-content transition-colors cursor-pointer flex-shrink-0"
          >
            <Icon name={isPasswordVisible ? 'Eye' : 'EyeOff'} size="md" className="text-body-content"/>
          </button>
        )}
      </div>
      <span className="text-xs sm:text-sm text-body-content">{label}</span>
    </div>
  );
};

export default ProfileInfoCard;