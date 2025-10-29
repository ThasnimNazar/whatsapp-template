import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const createTemplate = async (templateData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-template`, templateData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating template:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllTemplates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/templates`);
    return response.data.templates;
  } catch (error) {
    console.error("Error fetching templates:", error.response?.data || error.message);
    throw error;
  }
};

export const getTemplateById = async (templateId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/template/${templateId}`);
    return response.data.template;
  } catch (error) {
    console.error("Error fetching template:", error.response?.data || error.message);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-message`, messageData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTemplate = async (templateId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-template/${templateId}`, updatedData);
    console.log(response,'resp')
    return response.data;
  } catch (error) {
    console.error("Error updating template:", error);
    throw error;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/template/${templateId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting template:", error.response?.data || error.message);
    throw error;
  }
};

export const getTemplateLogs = async (templateId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/logs/${templateId}`);
    return response.data.logs;
  } catch (error) {
    console.error("Error fetching logs:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTemplateStatus = async (templateId, status) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/status/${templateId}`,{ status });
    return response.data;
  }
  catch (error) {
    console.error("Error fetching logs:", error.response?.data || error.message);
    throw error;
  }
};



