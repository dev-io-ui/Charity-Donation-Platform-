const { ImpactReport, Charity } = require('../models');

exports.createImpactReport = async (req, res) => {
  try {
    const { charityId } = req.params;
    // const{title , description , beneficiariesCount} = req.body;
    console.log("charityid is",charityId);
    const charity = await Charity.findByPk(charityId);
    console.log("charity is",charity);

    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    const report = await ImpactReport.create({
      ...req.body,
      CharityId: charityId
    });

    res.status(201).json({
      message: "Impact report created successfully",
      report
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCharityImpactReports = async (req, res) => {
  try {
    const { charityId } = req.params;
    const reports = await ImpactReport.findAll({
      where: { CharityId: charityId },
      order: [['reportDate', 'DESC']]
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateImpactReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await ImpactReport.findByPk(reportId);
    
    if (!report) {
      return res.status(404).json({ message: "Impact report not found" });
    }

    await report.update(req.body);

    res.json({
      message: "Impact report updated successfully",
      report
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteImpactReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await ImpactReport.findByPk(reportId);
    
    if (!report) {
      return res.status(404).json({ message: "Impact report not found" });
    }

    await report.destroy();

    res.json({ message: "Impact report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
