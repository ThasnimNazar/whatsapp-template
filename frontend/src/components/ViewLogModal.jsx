import { Modal, Table } from "antd";

const ViewLogsModal = ({ open, onCancel, logs }) => {
  const columns = [
    {
      title: "Recipient",
      dataIndex: "recipient",
      key: "recipient",
    },
    {
      title: "Placeholders",
      key: "placeHolders",
      render: (_, record) => (
        <pre style={{ margin: 0 }}>{JSON.stringify(record.placeHolders, null, 2)}</pre>
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
      width={700}
    >
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No logs available" }}
      />
    </Modal>
  );
};

export default ViewLogsModal;
