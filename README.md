# aws-codeartifact-delete-maven-package

Required: `aws-actions/configure-aws-credentials`

Delete maven package from AWS codeartifact targeted by the current pom.xml

## `domain`

The name of the domain that contains the package to delete.

### `domain-owner`

The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces.

## `region`

AWS CodeArtifact Region.

## `repository`

The name of the repository that contains the package versions to delete.

### Example

```yml
Test:
  runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: arn:aws:iam::*****
          aws-region: us-east-1
          
      - name: aws-codeartifact-delete-maven-package
        uses: Fred78290/aws-codeartifact-delete-maven-package@v****
        with:
          domain: release
          domain-owner: 123456789012
          region: us-east-1
          repository: fred78290
```
