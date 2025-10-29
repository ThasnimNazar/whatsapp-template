import { Modal, Table } from "antd";

const ViewLogsModal = ({ open, onCancel, logs }) => {
  const columns = [
    {
      title: "Recipient",
      dataIndex: "recipient",
      key: "recipient",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Placeholders",
      key: "placeHolders",
      render: (_, record) => (
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {JSON.stringify(record.placeHolders, null, 2)}
        </pre>
      ),
    },
    {
      title: "Date",
      dataIndex: "sentAt",
      key: "sentAt",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Template Usage Logs"
      footer={null}
      centered
      width={window.innerWidth < 768 ? "90%" : 700}
      bodyStyle={{
        overflowX: "auto",
        padding: "12px",
      }}
    >
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No logs available" }}
        scroll={{ x: true }}
        size="middle"
        style={{ minWidth: "100%" }}
      />
    </Modal>
  );
};

export default ViewLogsModal;
