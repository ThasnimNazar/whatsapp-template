import { useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, Select, Alert } from "antd";
import Preview from "./Preview";
import { createTemplate, updateTemplate } from "../utils/Api";

const { Option } = Select;


const CreateTemplateModal = ({ open, onCancel, loading, initialValues, mode, fetchTemplates }) => {
    const [form] = Form.useForm();
    const [messageBody, setMessageBody] = useState("");
    const [data, setData] = useState({});
    const [jsonText, setJsonText] = useState("");
    const [parsedData, setParsedData] = useState({});
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });
    console.log(initialValues,)
    console.log("Alert set:", alert);



    useEffect(() => {
        try {
            const parsed = JSON.parse(jsonText);
            setParsedData(parsed);
        } catch {
            setParsedData({});
        }
    }, [jsonText]);

    useEffect(() => {
        if (mode === "edit" && initialValues) {
            const dataValue =
                typeof initialValues.data === "string"
                    ? initialValues.data
                    : JSON.stringify(initialValues.data || {}, null, 2);

            form.setFieldsValue({
                name: initialValues.templateName,
                category: initialValues.category,
                language: initialValues.language,
                message: initialValues.message,
                data: dataValue,
            });

            setMessageBody(initialValues.message || "");
            setJsonText(dataValue);
        } else if (mode === "create" && open) {
            form.resetFields();
            setMessageBody("");
            setJsonText("");
            setParsedData({});
        }
    }, [mode, initialValues, form, open]);




    const handleFinish = async (values) => {
        try {
            const payload = {
                templateName: values.name,
                category: values.category,
                language: values.language,
                message: values.message,
                data: JSON.parse(values.data),
            };

            if (mode === "edit" && initialValues?._id) {
                await updateTemplate(initialValues._id, payload);
                setAlert({
                    type: "success",
                    message: "Template updated successfully!",
                    visible: true,
                });
            } else {
                await createTemplate(payload);
                setAlert({
                    type: "success",
                    message: "Template created successfully!",
                    visible: true,
                });
            }

            fetchTemplates();
            form.resetFields();
            setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
            onCancel();
        } catch (error) {
            console.error("Error saving template:", error);
            setAlert({
                type: "error",
                message: "Something went wrong while saving the template!",
                visible: true,
            });
            setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
        }
    };


    return (
        <>
            <Modal
                title={mode === "edit" ? "Edit Template" : "Create Template"}
                open={open}
                onCancel={onCancel}
                onOk={() => form.submit()}
                confirmLoading={loading}
                width={800}
                okButtonProps={{
                    style: {
                        background: "linear-gradient(90deg, #00BFA6 0%, #00A884 100%)",
                        border: "none",
                        color: "#fff",

                    },
                }}
            >

                <Row gutter={16}>
                    <Col span={12}>
                        <Form form={form} layout="vertical" onFinish={handleFinish}>
                            <Form.Item label="Template Name" name="name" rules={[{ required: true }]}>
                                <Input placeholder="Enter template name" />
                            </Form.Item>
                            <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category!" }]}>
                                <Select placeholder="Select a category">
                                    <Option value="payment">Payment</Option>
                                    <Option value="alert">Alert</Option>
                                    <Option value="otp">OTP</Option>
                                    <Option value="reminder">Reminder</Option>
                                    <Option value="promotion">Promotion</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Language" name="language" rules={[{ required: true, message: "Please select a language!" }]}>
                                <Select placeholder="Select a language">
                                    <Option value="en">English</Option>
                                    <Option value="hi">Hindi</Option>
                                    <Option value="ta">Tamil</Option>
                                    <Option value="ml">Malayalam</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Message" name="message" rules={[{ required: true }]}>
                                <Input.TextArea
                                    placeholder="Hi {{1}}, your OTP is {{2}}"
                                    onChange={(e) => setMessageBody(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Data (JSON)" name="data" rules={[{ required: true }]}>
                                <Input.TextArea
                                    placeholder='{"1":"Abc","2":"1234"}'
                                    onChange={(e) => setJsonText(e.target.value)}
                                />
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col span={12}>
                        <Preview message={messageBody} data={parsedData} />
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

export default CreateTemplateModal;
