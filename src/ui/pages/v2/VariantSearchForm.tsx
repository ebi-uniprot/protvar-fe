import React, { useState } from 'react';
import {
  Card,
  Form,
  Button,
  ButtonGroup,
  Row,
  Col
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { VariantSearchInput, GenomeAssembly } from './types';

const VariantSearchForm: React.FC = () => {
  const [input, setInput] = useState<VariantSearchInput>({
    variantText: '',
    uploadedFile: null,
    genomeAssembly: 'auto',
  });

  const navigate = useNavigate();

  const handleExampleClick = (example: string) => {
    setInput(prev => ({ ...prev, variantText: example }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setInput(prev => ({ ...prev, uploadedFile: file, variantText: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/results', { state: input });
  };

  const variants = input.variantText
    ?.split(/\r?\n|[,;]/) // split by newline, comma, or semicolon
    .map(v => v.trim())
    .filter(v => v.length > 0);

  return (
    <Card className="shadow-sm">
      <Card.Header className="mb-2" style={{backgroundColor: "#014373", color: "white"}}>Search single nucleotide
        variants</Card.Header>
      <Form className="p-4" onSubmit={handleSubmit}>
        <Row>
          {/* Left side: Variant Textbox */}
          <Col md={8}>
            <Form.Group controlId="variantInput">
              <Form.Label>Paste your variants below or upload a file.</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder={`Paste multiple variants:\nchr1:123456A>T\nNM_000546.5:c.215C>G\nrs123456`}
                value={input.variantText}
                onChange={(e) =>
                  setInput({...input, variantText: e.target.value, uploadedFile: null})
                }
              />
              <Form.Text className="text-muted">
                One variant per line, or separated by comma/semicolon.
              </Form.Text>
            </Form.Group>
          </Col>

          {/* Right side: Options */}
          <Col md={4}>
            <div className="mb-3">
              <Form.Label>Examples</Form.Label>
              <ButtonGroup className="w-100">
                <Button variant="outline-secondary" onClick={() => handleExampleClick('chr1:123456A>T')}>
                  Genomic
                </Button>
                <Button variant="outline-secondary" onClick={() => handleExampleClick('NM_000546.5:c.215C>G')}>
                  cDNA
                </Button>
                <Button variant="outline-secondary" onClick={() => handleExampleClick('NP_000537.3:p.Arg72Pro')}>
                  Protein
                </Button>
                <Button variant="outline-secondary" onClick={() => handleExampleClick('rs123456')}>
                  Variant ID
                </Button>
              </ButtonGroup>
            </div>

            <Form.Group className="mb-3" controlId="genomeAssembly">
              <Form.Label>Genome Assembly</Form.Label>
              <Form.Select
                value={input.genomeAssembly}
                onChange={(e) =>
                  setInput({...input, genomeAssembly: e.target.value as GenomeAssembly})
                }
              >
                <option value="auto">Auto</option>
                <option value="grch37">GRCh37</option>
                <option value="grch38">GRCh38</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="uploadFile" className="mb-3">
              <Form.Label>Upload Variant File</Form.Label>
              <Form.Control type="file" onChange={handleFileChange}/>
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Button type="submit" variant="primary" size="lg">
            Search
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default VariantSearchForm;