# Annotation Tab Direct Linking

Share direct links to specific annotation tabs by adding the `annotation` parameter to any ProtVar variant URL.

## URL Format

```
/ProtVar/.../?annotation=<type>[-row]
```

Where `...` is your variant query (e.g., `P22304/205/A/P` or `chr19/1010539/G/C`).

## Tab Types & Row Selection

| Tab        | Short | Long        | Example                          |
|------------|-------|-------------|----------------------------------|
| Functional | `fun` | `functional`| `?annotation=fun` or `?annotation=fun-2` |
| Structural | `str` | `structural`| `?annotation=str` or `?annotation=str-2` |
| Population | `pop` | `population`| `?annotation=pop` or `?annotation=pop-3` |

**Default:** Omit row number for row 1 (e.g., `?annotation=str` = row 1).

## Examples

### Basic Annotation Tabs

```bash
# Functional, Population, Structural (row 1)
?annotation=fun
?annotation=pop
?annotation=str

# Specific rows
?annotation=fun-2      # Functional, row 2
?annotation=str-3      # Structural, row 3
?annotation=pop-5      # Population, row 5
```

### With Structure Parameters (Structural Tab Only)

Structure parameters only work with `annotation=str`.  
See **Structure Tab Direct Linking** for details.

```bash
# PDB with chain
?annotation=str&structure=pdb:1ABC&highlight_chain=A

# AlphaFold with pocket
?annotation=str&structure=prediction&highlight_pocket=p1&zoom=true

# Interaction with interface
?annotation=str&structure=interaction:P12345_P67890&highlight_interface

# Different row with structure
?annotation=str-2&structure=pdb:2DEF&zoom=true
```

### Complete URLs

```bash
# Protein-based query
/ProtVar/P22304/205/A/P?annotation=str&structure=pdb:1ABC&highlight_chain=A

# Chromosome-based query
/ProtVar/chr19/1010539/G/C?annotation=str&structure=pdb&zoom=true

# Search query
/ProtVar/query?search=rs864622779&annotation=pop
```

---

**Notes**

- Row numbers are 1-indexed (first row = 1).
- Long formats (`functional`, `structural`, `population`) still work.
- Short format (`fun`, `str`, `pop`) is recommended for new links.
- Both `?annotation=str-1` and `?annotation=str` open row 1.
