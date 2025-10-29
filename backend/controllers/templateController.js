const Template = require('../models/templateModel')
const Logs = require('../models/logSchema')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createTemplate = async (req, res) => {
  try {
    const { templateName, category, language, message, data } = req.body;
    console.log(req.body, 'req-body')

    if (!templateName || !category || !language || !message || !data) {
      return res.status(400).json({ message: "missing required fields!" })
    }

    const templateExists = await Template.findOne({ templateName: templateName })
    if (templateExists) {
      return res.status(500).json({ message: 'template with the name already exist!' })
    }

    const newTemplate = new Template({
      templateName: templateName,
      category,
      language,
      message: message,
      data
    })

    await newTemplate.save();
    return res.status(200).json({ newTemplate })
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({})
      .sort({ updatedAt: -1, createdAt: -1 });

    if (!templates) {
      return res.status(404).json({ message: "Templates not found in the DB!" })
    }
    return res.status(200).json({ templates })
  }
  catch (error) {
    console.log(error.message)
    return res.status(200).json({ message: error.message })
  }
}

const viewTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    console.log(req.params, 'params')
    const template = await Template.findById(templateId)
    if (!template) {
      return res.status(404).json({ message: 'template not found in the DB!' })
    }
    return res.status(200).json({ template })
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const editTemplate = async (req, res) => {
  try {
    console.log('hellooo')
    const { templateId } = req.params;
    const { templateName, category, language, message } = req.body;

    const existingTemplate = await Template.findById(templateId);
    if (!existingTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    existingTemplate.templateName = templateName || existingTemplate.templateName;
    existingTemplate.category = category || existingTemplate.category;
    existingTemplate.language = language || existingTemplate.language;
    existingTemplate.message = message || existingTemplate.message;

    const updatedTemplate = await existingTemplate.save();

    return res.status(200).json({
      message: "Template updated successfully!",
      template: updatedTemplate,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};


const deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    await Template.findByIdAndDelete(templateId)
    return res.status(200).json({ message: 'template deleted successfully!' })
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const sendTemplateMessage = async (req, res) => {
  try {
    const { recipient, templateName, placeholders } = req.body;
    console.log(req.body, 'body')

    if (!recipient || !templateName) {
      return res.status(400).json({ message: "missing required fields!" });
    }

    const template = await Template.findOne({ templateName: templateName })
    if (!template) {
      return res.status(404).json({ message: "Template not found!" })
    }

    await delay(1000);

    template.sentCount = (template.sentCount || 0) + 1;
    await template.save();

    const logs = new Logs({
      template: template._id,
      recipient,
      placeHolders: placeholders,
    })

    await logs.save();

    const placeholderText = Object.entries(placeholders)
      .map(([key, value]) => `  "${key}": "${value}"`)
      .join(",\n");

    const Message = `Template "${templateName}" sent to ${recipient} with data: {\n${placeholderText}\n}`;

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      sentCount: template.sentCount,
      details: Message,
    });

  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const getAllLogs = async (req, res) => {
  try {
    const { templateId } = req.params;

    const allLogs = await Logs.find({ template: templateId }).populate("template").sort({ sentAt: -1 });

    if (!allLogs || allLogs.length === 0) {
      return res.status(404).json({ message: "No logs found for this template" });
    }

    return res.status(200).json({ logs: allLogs });
  } catch (error) {
    console.error("Error fetching logs:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const updateTemplateStatus = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      templateId,
      { status },
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.status(200).json({
      message: `Template status updated to ${status}`,
      template: updatedTemplate,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};





module.exports = {
  createTemplate,
  getAllTemplates,
  viewTemplate,
  editTemplate,
  deleteTemplate,
  sendTemplateMessage,
  getAllLogs,
  updateTemplateStatus
}
