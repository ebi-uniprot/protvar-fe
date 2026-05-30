import React from 'react';
import { API_URL } from '../../../../constants/const';
import { HelpCommandBlock } from '../shared/HelpCommandBlock';
import { HelpPromptCard } from '../shared/HelpPromptCard';

// The MCP endpoint mirrors the API base URL for whichever environment the
// front-end is pointed at: .../ProtVar/api  ->  .../ProtVar/mcp
const MCP_URL = (API_URL ?? 'https://www.ebi.ac.uk/ProtVar/api').replace(/\/api\/?$/, '/mcp');

const TOOL_GROUPS: { group: string; tools: { name: string; desc: string }[] }[] = [
  {
    group: 'Mapping',
    tools: [
      { name: 'mapVariant', desc: 'Map a single variant and return its full annotations' },
      { name: 'mapVariants', desc: 'Map a batch of variants at once' },
    ],
  },
  {
    group: 'Annotations',
    tools: [
      { name: 'getFunction', desc: 'Functional annotations and pathogenicity scores for a residue' },
      { name: 'getPopulation', desc: 'Co-located population and known variants at a residue' },
      { name: 'getStructure', desc: 'PDB structural context for a residue' },
    ],
  },
  {
    group: 'Predictions',
    tools: [
      { name: 'getFoldx', desc: 'FoldX stability change (ΔΔG) for a variant' },
      { name: 'getPockets', desc: 'Predicted ligand-binding pockets near a residue' },
      { name: 'getInteractions', desc: 'Predicted protein–protein interaction interfaces' },
    ],
  },
  {
    group: 'Search',
    tools: [
      { name: 'semanticSearch', desc: 'Natural-language search over protein functions' },
      { name: 'searchVariants', desc: 'Filter variants by structural and functional criteria' },
    ],
  },
];

export const McpHelp: React.FC = () => {
  return (
    <div className="help-content">
      <h1 id="mcp">
        ProtVar MCP{' '}
        <span className="experimental-text-badge">
          <i className="bi bi-flask" /> experimental
        </span>
      </h1>

      <p>
        The <strong>ProtVar MCP server</strong> lets AI assistants such as Claude query ProtVar
        directly. Instead of opening the website and filling in forms, you can ask questions about
        protein variants in plain language, and the assistant retrieves the answer from ProtVar for
        you — mapping variants, fetching annotations, and running structural predictions on your
        behalf.
      </p>
      <p>
        It is built on the{' '}
        <a href="https://modelcontextprotocol.io/" target="_blank" rel="noreferrer">
          Model Context Protocol (MCP)
        </a>
        , an open standard for connecting AI assistants to external tools and data.
      </p>

      <h2>What you can ask</h2>
      <p>
        Once connected, ask questions in everyday language — the assistant picks the right ProtVar
        tool automatically. Some examples:
      </p>
      <HelpPromptCard>What is the predicted stability impact (FoldX ΔΔG) of the TP53 variant R175H?</HelpPromptCard>
      <HelpPromptCard>Map 17-7676154-G-A and summarise what is known about it.</HelpPromptCard>
      <HelpPromptCard>Are there any predicted ligand-binding pockets near BRCA1 residue 1700?</HelpPromptCard>
      <HelpPromptCard>Which proteins are involved in DNA mismatch repair?</HelpPromptCard>
      <HelpPromptCard>Find variants in EGFR that fall within predicted protein interaction interfaces.</HelpPromptCard>

      <h2>Connecting ProtVar MCP</h2>
      <p>
        The ProtVar MCP server runs over HTTP at the address below — no installation or download
        needed. Add it once to your AI assistant and it stays available.
      </p>
      <HelpCommandBlock cmd={MCP_URL} />

      <h3>Claude.ai and Claude Desktop</h3>
      <p>The friendliest option — point-and-click, no command line:</p>
      <ol>
        <li>Open <strong>Settings → Connectors</strong> (in the Claude desktop app or on claude.ai).</li>
        <li>Click <strong>Add custom connector</strong>.</li>
        <li>Give it a name (e.g. <em>ProtVar</em>) and paste the URL above.</li>
        <li>
          Save. ProtVar's tools are now available in any chat — start a new conversation and ask one
          of the questions above.
        </li>
      </ol>

      <h3>Claude Code (command line)</h3>
      <p>If you use the Claude Code CLI, register the server with a single command:</p>
      <HelpCommandBlock cmd={`claude mcp add protvar --transport http ${MCP_URL}`} />
      <p>
        Then run <code>/mcp</code> inside a Claude Code session to confirm it is connected and list
        the available tools.
      </p>

      <h2>Available tools</h2>
      <p>The MCP server exposes ten tools. You never call these directly — the assistant chooses them — but they show what ProtVar MCP can do:</p>
      {TOOL_GROUPS.map((g) => (
        <div key={g.group} className="help-tool-group">
          <strong>{g.group}</strong>
          <ul>
            {g.tools.map((t) => (
              <li key={t.name}>
                <code>{t.name}</code> — {t.desc}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Notes</h2>
      <ul>
        <li>
          ProtVar MCP is read-only — assistants can query variant data but cannot change anything.
        </li>
        <li>
          As an experimental feature it may change. For issues or feedback, email{' '}
          <a href="mailto:protvar@ebi.ac.uk">protvar@ebi.ac.uk</a>.
        </li>
      </ul>
    </div>
  );
};
