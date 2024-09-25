#### <a id="api"></a>API

ProtVar REST API is a programmatic way to obtain information from ProtVar. You can query:

- A list of variants via their genomic coordinates and choose which annotations you require. These can be posted as a list and then downloaded or emailed or a file can be uploaded.
- Genomic coordinates to retrieve mappings to positions in proteins for all isoforms.
- Individual amino acid positions to retrieve functional/structural/co-located variant annotations via a json object.

REST API uses OpenAPI 3 which means you can use utils like openapi-generator to generate model classes.
