import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Alert, Row, Col } from "antd";
import { sendMessage } from "../utils/Api";
import Preview from "./Preview";

const SendMessageModal = ({ open, onCancel, template }) => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [form] = Form.useForm();
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });
    const [previewMessage, setPreviewMessage] = useState("");

    const placeholders = template?.message?.match(/{{\d+}}/g) || [];

    useEffect(() => {
        if (!open) {
            form.resetFields();
            setResponse(null);
            setPreviewMessage("");
        } else {
            setPreviewMessage(template?.message || "");
        }
    }, [open, template]);

    useEffect(() => {
        let timer;
        if (response) {
            timer = setTimeout(() => {
                onCancel();
                setResponse(null);
                form.resetFields();
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [response]);

    const handleFormChange = () => {
        const values = form.getFieldsValue();
        let updatedMessage = template?.message || "";
        
        if (values.placeholders) {
            Object.keys(values.placeholders).forEach((key) => {
                const value = values.placeholders[key];
                if (value) {
                    updatedMessage = updatedMessage.replace(`{{${key}}}`, value);
                }
            });
        }
        
        setPreviewMessage(updatedMessage);
    };

    const handleSend = async (values) => {
        const { phoneNumber, placeholders } = values;

        setLoading(true);
        try {
            const data = {
                recipient: phoneNumber,
                templateName: template?.templateName,
                placeholders,
            };

            const res = await sendMessage(data);
            setResponse(res);
            setAlert({
                type: "success",
                message: "Message sent successfully!",
                visible: true,
            });
            setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
        } catch (err) {
            console.error("Error saving template:", err);
            setAlert({
                type: "error",
                message: "Something went wrong while saving the template!",
                visible: true,
            });
            setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onCancel={onCancel}
                title="Send Template Message"
                onOk={() => form.submit()}
                confirmLoading={loading}
                width={900}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form 
                            form={form} 
                            layout="vertical" 
                            onFinish={handleSend}
                            onValuesChange={handleFormChange}
                        >
                            <Form.Item
                                label="Category"
                                name="category"
                                initialValue={template?.category || "N/A"}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                label="Recipient Number"
                                name="phoneNumber"
                                rules={[{ required: true, message: "Please enter recipient number" }]}
                            >
                                <Input placeholder="+91XXXXXXXXXX" />
                            </Form.Item>

                            <div>
                                <label style={{ fontWeight: 500 }}>Placeholder Values</label>
                                {placeholders.length ? (
                                    placeholders.map((ph, index) => (
                                        <Form.Item
                                            key={index}
                                            name={["placeholders", ph.replace(/[{}]/g, "")]}
                                            label={`Value for ${ph}`}
                                            rules={[{ required: true, message: `Enter value for ${ph}` }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    ))
                                ) : (
                                    <p>No placeholders found</p>
                                )}
                            </div>
                        </Form>

                        {response && (
                            <div style={{ marginTop: "20px" }}>
                                <h4>API Response:</h4>
                                <pre>{response.details}</pre>
                            </div>
                        )}
                    </Col>

                    <Col span={12}>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            transform: 'scale(0.65)',
                            transformOrigin: 'center'
                        }}>
                            <h4 style={{ marginBottom: '8px', fontSize: '14px' }}>Preview</h4>
                            <Preview message={previewMessage} />
                        </div>
                    </Col>
                </Row>
            </Modal>

            {alert.visible && (
                <div
                    style={{
                        position: "fixed",
                        right: 24,
                        top: 24,
                        zIndex: 9999,
                        width: 350,
                    }}
                >
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        showIcon
                        closable
                        onClose={() => setAlert({ ...alert, visible: false })}
                    />
                </div>
            )}
        </>
    );
};

export default SendMessageModal;