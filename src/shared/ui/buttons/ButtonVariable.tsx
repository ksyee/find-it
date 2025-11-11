interface ButtonVariableProps {
  buttonText: string;
  variant:
    | 'normal'
    | 'submit'
    | 'disabled'
    | 'lineStyle'
    | 'blackSolidThin'
    | 'blackLineThin'
    | 'primarySolidThin';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'reset' | 'submit';
}
const ButtonVariable = ({
  buttonText = '확인',
  variant = 'normal',
  onClick,
  type: overrideType,
  ...restProps
}: ButtonVariableProps) => {
  let buttonType: 'button' | 'reset' | 'submit' | undefined = overrideType;
  let background, color, borderColor, width, height;
  switch (variant) {
    case 'submit':
      buttonType = buttonType ?? 'submit';
      background = '#4785ff';
      color = 'white';
      borderColor = '#4785ff';
      width = '100%';
      height = '66px';
      break;
    case 'disabled':
      buttonType = buttonType ?? 'button';
      background = '#666666';
      color = '#BCBCBC';
      borderColor = '#666666';
      width = '100%';
      height = '66px';

      break;
    case 'lineStyle':
      buttonType = buttonType ?? 'button';
      background = 'white';
      color = '#4785ff';
      borderColor = '#4785ff';
      width = '100%';
      height = '66px';
      break;
    case 'blackSolidThin':
      buttonType = buttonType ?? 'button';
      background = 'black';
      color = 'white';
      borderColor = 'black';
      width = '315px';
      height = '53px';
      break;
    case 'blackLineThin':
      buttonType = buttonType ?? 'button';
      background = 'white';
      color = 'black';
      borderColor = 'black';
      width = '315px';
      height = '53px';
      break;
    case 'primarySolidThin':
      buttonType = buttonType ?? 'button';
      background = '#4785ff';
      color = 'white';
      borderColor = '#4785ff';
      width = '315px';
      height = '53px';
      break;
    default:
      break;
  }

  return (
    <button
      type={buttonType}
      onClick={onClick}
      style={{
        width,
        height,
        background,
        color,
        border: `1px solid ${borderColor}`,
        borderRadius: '20px',
      }}
      disabled={variant === 'disabled'}
      {...restProps}
    >
      {buttonText}
    </button>
  );
};

export default ButtonVariable;
