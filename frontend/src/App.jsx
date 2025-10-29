import { useState, useEffect } from "react";
import { Layout, Card, Button, Table, Typography, message, Input, Select, Popconfirm, Tag, Modal, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined, EyeOutlined, SendOutlined, SearchOutlined, FileTextOutlined, MessageOutlined } from "@ant-design/icons";
import { createTemplate, getAllTemplates, getTemplateById, getTemplateLogs, deleteTemplate, updateTemplateStatus } from "./utils/Api";

import CreateTemplateModal from "./components/CreateTemplateModal";
import ViewTemplateModal from "./components/ViewTemplateModal";
import SendMessageModal from "./components/SendMessageModal";
import ViewLogsModal from "./components/ViewLogModal";


const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function TemplateManagement() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [mode, setMode] = useState("create");
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState(undefined);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    handleFilterAndSearch();
  }, [searchText, filterCategory, templates]);

  const fetchTemplates = async () => {
    try {
      const data = await getAllTemplates();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      message.error("Failed to fetch templates");
    }
  };

  const handleFilterAndSearch = () => {
    let filtered = [...templates];

    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.templateName.toLowerCase().includes(search) ||
          t.category.toLowerCase().includes(search)
      );
    }


    if (filterCategory) {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    setFilteredTemplates(filtered);
  };


  const handleView = async (record) => {
    console.log(record, 'record')
    setViewModalOpen(true);
    setLoadingView(true);
    try {
      const template = await getTemplateById(record._id);
      setSelectedTemplate(template);
    } catch (error) {
      message.error("Failed to load template details");
    } finally {
      setLoadingView(false);
    }
  };

  const handleCreate = () => {
  setSelectedTemplate(null);
  setMode("create");
  setIsModalOpen(true);
};

  const handleEdit = (template) => {
    setMode("edit");
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleSend = (record) => {
    setSelectedTemplate(record);
    setSendModalOpen(true);
  };

  const handleDelete = async (templateId) => {
    try {
      setLoading(true);
      await deleteTemplate(templateId);
      setAlert({
        type: "success",
        message: "Template deleted successfully!",
        visible: true,
      });
      fetchTemplates();
      setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete template");
    } finally {
      setLoading(false);
    }
  };


  const handleViewLogs = async (record) => {
    setLogsModalOpen(true);
    setLoadingLogs(true);
    try {
      const fetchedLogs = await getTemplateLogs(record._id);
      setLogs(fetchedLogs);
    } catch (error) {
      message.error("Failed to load logs");
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleStatusChange = async (templateId, newStatus) => {
    try {
      const res = await updateTemplateStatus(templateId, newStatus);
      console.log(res, 'res')

      setAlert({
        type: "success",
        message: "Status changed successfully!",
        visible: true,
      });
      setTemplates((prev) =>
        prev.map((t) =>
          t._id === templateId ? { ...t, status: newStatus } : t
        )
      );
      setFilteredTemplates((prev) =>
        prev.map((t) =>
          t._id === templateId ? { ...t, status: newStatus } : t
        )
      );
      setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
    } catch (err) {
      console.error(err);
      message.error("Failed to update status. Please try again.");
    }
  };





  const columns = [
    {
      title: "Name",
      dataIndex: "templateName",
      key: "templateName"
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category"
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag
          color={
            record.status === "Approved"
              ? "green"
              : record.status === "Rejected"
                ? "red"
                : "gold"
          }
        >
          {record.status}
        </Tag>
      ),
    },
    {
      title: "Change Status",
      key: "changeStatus",
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 130 }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Approved">Approved</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
        </Select>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language"
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<SendOutlined />}
            onClick={() => handleSend(record)}
          />
          <Button
            type="text"
            icon={<FileTextOutlined />}
            onClick={() => handleViewLogs(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this template?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Header
          style={{
            background: "linear-gradient(90deg, #00BFA6 0%, #00A884 100%)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            textAlign: "center",
            padding: "1rem 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <MessageOutlined style={{ fontSize: "28px", color: "white" }} />
            <Title
              level={3}
              style={{
                margin: 0,
                color: "white",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              WhatsApp Template Management System
            </Title>
          </div>
        </Header>

        <Content style={{ padding: "40px" }}>
          <Card
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Templates
              </Title>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Input
                  placeholder="Search by template name,category"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 220 }}
                />

                <Select
                  placeholder="Filter by category"
                  value={filterCategory}
                  onChange={(val) => setFilterCategory(val)}
                  style={{ width: 180 }}
                  allowClear
                >
                  <Option value="payment">Payment</Option>
                  <Option value="alert">Alert</Option>
                  <Option value="otp">OTP</Option>
                  <Option value="reminder">Reminder</Option>
                  <Option value="promotion">Promotion</Option>
                </Select>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                style={{
                  background: "linear-gradient(90deg, #00BFA6 0%, #00A884 100%)",
                }}
              >
                Create Template
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={filteredTemplates}
              rowKey="_id"
              pagination={false}
              scroll={{ x: true }}
              locale={{ emptyText: "No templates yet" }}
            />
          </Card>

          <CreateTemplateModal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            loading={loading}
            mode={mode}
            initialValues={selectedTemplate}
            fetchTemplates={fetchTemplates}
          />

          <ViewTemplateModal
            open={viewModalOpen}
            onCancel={() => setViewModalOpen(false)}
            loading={loadingView}
            template={selectedTemplate}
          />

          <SendMessageModal
            open={sendModalOpen}
            onCancel={() => setSendModalOpen(false)}
            template={selectedTemplate}
          />

          <ViewLogsModal
            open={logsModalOpen}
            onCancel={() => setLogsModalOpen(false)}
            logs={logs}
          />


        </Content>
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

      </Layout>
    </>
  );
}

export default TemplateManagement;
