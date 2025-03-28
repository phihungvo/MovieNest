import { Button } from 'antd';

function SmartButton({
    size = 'middle', // large | middle | small
    type = 'primary',
    title = 'Button',
    buttonWidth = 38,
    buttonHeight = 38,
    icon = null,
}) {
    return (
        <>
            <Button
                size={size}
                type={type}
                buttonWidth={buttonWidth}
                buttonHeight={buttonHeight}
                icon={icon}
                // style={{ width: inputWidth, height: inputHeight }}
            >
                {title}
            </Button>
        </>
    );
}

export default SmartButton;
