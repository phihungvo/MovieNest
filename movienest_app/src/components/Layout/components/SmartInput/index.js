import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

function SmartInput({
    size = 'medium',
    placeholder = 'Input',
    inputWidth = 250,
    inputHeight = 38,
    icon = <SearchOutlined />,
}) {
    return (
        <>
            <Input
                size={size}
                placeholder={placeholder}
                style={{ width: inputWidth, height: inputHeight }}
                prefix={
                    icon && (
                        <span style={{ fontSize: '24px', color: '#1890ff' }}>
                            {icon}
                        </span>
                    )
                }
            />
        </>
    );
}

export default SmartInput;
