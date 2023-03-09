# .github/workflows/my-workflow.yml
on: [push]

jobs:
  dev:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: cupcakearmy/confluence-markdown-sync@v1
        with:
          from: './README.md'
          to: '23396353' # The confluence page id where to write the output
          cloud: ${{ secrets.CONFLUENCE_CLOUD_ID }}
          user: ${{ secrets.CONFLUENCE_CLOUD_EMAIL
          token: ${{ secrets.CONFLUENCE_CLOUD_TOKEN }}