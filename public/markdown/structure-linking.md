# Structure Tab Direct Linking

Share direct links to specific 3D structure views.  
Structure parameters work with the **Structural annotation tab** (`annotation=str`).  
See **Annotation Tab Direct Linking** for annotation details.

## URL Format

```
/ProtVar/.../?annotation=str[-row]&structure=<type>:<id>&<visualization_options>
```

Where `...` is your variant query (e.g., `P22304/205/A/P` or `chr19/1010539/G/C`).

## Structure Types

| Type | Format | Example |
|------|--------|---------|
| **PDB** | `pdb:1ABC` or `pdb` (first available) | `?annotation=str&structure=pdb:1ABC` |
| **AlphaFold** | `prediction` or `prediction:AlphaFold` | `?annotation=str&structure=prediction` |
| **AlphaFill** | `prediction:AlphaFill` | `?annotation=str&structure=prediction:AlphaFill` |
| **Interaction** | `interaction:P12345_P67890` or `interaction` | `?annotation=str&structure=interaction:P12345_P67890` |

## Visualization Options

| Parameter | Works With | Example |
|-----------|------------|---------|
| `highlight_chain=A` | PDB only | `&highlight_chain=A` |
| `highlight_pocket=p1` | AlphaFold / AlphaFill | `&highlight_pocket=p1` |
| `highlight_interface` | Interactions only | `&highlight_interface` |
| `zoom=true` | All types | `&zoom=true` |

## Examples

### PDB Structures

```bash
# Basic PDB
?annotation=str&structure=pdb:1ABC

# With chain highlighted
?annotation=str&structure=pdb:1ABC&highlight_chain=A

# With chain and zoom
?annotation=str&structure=pdb:1ABC&highlight_chain=B&zoom=true

# Row 2 with different PDB
?annotation=str-2&structure=pdb:2DEF&highlight_chain=A
```

### AlphaFold / AlphaFill

```bash
# Basic AlphaFold
?annotation=str&structure=prediction

# With pocket highlighted
?annotation=str&structure=prediction&highlight_pocket=p1

# With pocket and zoom
?annotation=str&structure=prediction&highlight_pocket=p2&zoom=true

# AlphaFill structure
?annotation=str&structure=prediction:AlphaFill&highlight_pocket=p1
```

### Protein Interactions

```bash
# Basic interaction
?annotation=str&structure=interaction:P12345_P67890

# With interface highlighted
?annotation=str&structure=interaction:P12345_P67890&highlight_interface

# With interface and zoom
?annotation=str&structure=interaction:P12345_P67890&highlight_interface&zoom=true
```

### Complete URLs

```bash
# Protein-based query
/ProtVar/P22304/205/A/P?annotation=str&structure=pdb:1ABC&highlight_chain=A

# Chromosome-based query
/ProtVar/chr19/1010539/G/C?annotation=str&structure=pdb&zoom=true

# Search query
/ProtVar/query?search=rs864622779&annotation=str&structure=prediction

# Different rows
/ProtVar/P22304/205/A/P?annotation=str-2&structure=prediction&highlight_pocket=p1
```

**Notes**

- Variant position is always highlighted by default.
- Chain IDs are case-sensitive (`A` vs `a`).
- Pocket IDs use the format `p1`, `p2`, `p3`.
- Omit the row number for row 1 (use `?annotation=str`, not `?annotation=str-1`).
- Structure-only links (`?structure=pdb:1ABC` without `annotation=str`) work but require manual tab opening.
