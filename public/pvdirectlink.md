##### <a name="direct-variant-link"></a>Direct variant Link Help

You can access variant annotations directly using the following URL structures and bypassing the input screen.
You can use genomic coordinates, protein positions but you must state both the reference and variant allele,
and also use search terms as you would do in the Search Variants box.

Examples of valid requests are given below.

Using genomic coordinates:

> www.ebi.ac.uk/ProtVar/query?chromosome=19&genomic_position=1010539&reference_allele=G&alternative_allele=C  
> www.ebi.ac.uk/ProtVar/query?chromosome=14&genomic_position=89993420&reference_allele=A&alternative_allele=G  
> www.ebi.ac.uk/ProtVar/query?chromosome=10&genomic_position=87933147&reference_allele=C&alternative_allele=T

Using protein accession and position:

> www.ebi.ac.uk/ProtVar/query?accession=Q4ZIN3&protein_position=558&reference_AA=S&variant_AA=R  
> www.ebi.ac.uk/ProtVar/query?accession=Q9NUW8&protein_position=493&reference_AA=H&variant_AA=R  
> www.ebi.ac.uk/ProtVar/query?accession=P60484&protein_position=130&reference_AA=R&variant_AA=T  
> www.ebi.ac.uk/ProtVar/query?accession=P60484&protein_position=130&reference_AA=N&variant_AA=G

Using search terms:

> www.ebi.ac.uk/ProtVar/query?search=NC_000021.9:g.25905076A>T  
> www.ebi.ac.uk/ProtVar/query?search=rs864622779,P22304%20A205P

The search option supports all the accepted formats and up to a maximum of 10 inputs separated by comma. Note that any
space in the URL will be encoded (converted) to a special character for e.g. `P22304 A205P` becomes `P22304%20A205P` in the above input.