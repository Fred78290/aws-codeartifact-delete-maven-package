const core = require('@actions/core');
const codeArtifact = require('@aws-sdk/client-codeartifact');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser
const fs = require('fs');

function getValue(doc, xpathToSearch) {
  var nodes = xpath.select(xpathToSearch, doc);

  if (nodes.length) {
    var node = nodes[0];
    var firstChild = node.firstChild;

    if (firstChild) {
      return firstChild.data;
    } else {
      return node.value;
    }
  }

  core.setFailed(xpathToSearch + ' did not return any nodes.');
}

async function run() {
  const pom = process.env.GITHUB_WORKSPACE + '/pom.xml';
  const region = core.getInput('region', { required: true });
  const domain = core.getInput('domain', { required: true });
  const account = core.getInput('domain-owner', { required: true });
  const repo = core.getInput('repository', { required: true });

  fs.readFile(pom, 'utf8', async function read(err, data) {
    if (err) {
      core.setFailed(err.message);
    } else {
      const doc = new dom().parseFromString(data);
      const groupId = getValue(doc, "//*[local-name()='project']/*[local-name()='groupId']");
      const artefactId = getValue(doc, "//*[local-name()='project']/*[local-name()='artifactId']");
      const versions = [ getValue(doc, "//*[local-name()='project']/*[local-name()='version']") ];

      const client = new codeArtifact.CodeartifactClient({ region: region });

      const authCommand = new codeArtifact.DeletePackageVersionsCommand({
        domain: domain,
        domainOwner: account,
        repository: repo,
        format: 'maven',
        namespace: groupId,
        package: artefactId,
        versions: versions
      });

      try {
        const response = await client.send(authCommand);
    
        if (response.failedVersions != undefined) {
          core.setOutput('failedVersions', response.failedVersions);
        }
      
        if (response.successfulVersions != undefined) {
          core.setOutput('successfulVersions', response.successfulVersions);
        }  
      } catch (error) {
        core.error(error);
      }
    }
  });
}

module.exports = run;

if (require.main === module) {
  run();
}
