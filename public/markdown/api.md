# <a id="api"></a>API

ProtVar REST API is a programmatic way to obtain information from ProtVar. You can query:

- A list of variants via their genomic coordinates and choose which annotations you require. These can be posted as a list and then downloaded, emailed, or uploaded as a file.
- Genomic coordinates to retrieve mappings to positions in proteins for all isoforms.
- Individual amino acid positions to retrieve functional, structural, or co-located variant annotations via a JSON object.

REST API uses OpenAPI 3, which means you can use tools like `openapi-generator` to generate model classes.
