import React from "react";
import { Modal, Spin, Typography } from "antd";
import Preview from "./Preview";

const { Text } = Typography;

const ViewTemplateModal = ({ open, onCancel, loading, template }) => {
    console.log(template,'temp')
  return (
    <Modal
      title="View Template"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          <Spin tip="Loading template..." />
        </div>
      ) : template ? (
        <Preview message={template.message} data={template.data || {}} />
      ) : (
        <Text type="secondary">No data available</Text>
      )}
    </Modal>
  );
};

export default ViewTemplateModal;
