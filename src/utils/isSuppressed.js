const config = require('../config');
const logger = require('./logger');

module.exports = ({suppressionList, auditAdvisory}) => {
    const {advisory} = auditAdvisory;
    const logData = {
        findings: advisory.findings,
        githubAdvisoryId: advisory.github_advisory_id,
    };

    const supressionData = suppressionList.find(({githubAadvisoryId, githubAdvisoryId}) =>
        githubAadvisoryId === advisory.github_advisory_id || githubAdvisoryId === advisory.github_advisory_id);

    if (!supressionData?.suppress) {
        logger.warn(`An advisory has been found. You can suppress this in ${config.SUPPRESSION_FILE}`, logData);
        return false;
    }

    const isSuppressed = new Date(supressionData.suppress?.until).getTime() > Date.now();

    if (!isSuppressed) {
        logger.warn('Suppression has expired!', logData);
    }

    return isSuppressed;
};
