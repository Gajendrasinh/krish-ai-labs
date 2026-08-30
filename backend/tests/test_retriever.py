from app.retriever import TfidfRetriever


def test_finds_services_section_for_rag_query():
    retriever = TfidfRetriever()
    hits = retriever.search("Do you build RAG applications?")
    assert hits, "expected at least one match"
    assert any(h.chunk.source == "services.md" for h in hits)
    assert any("RAG" in h.chunk.heading for h in hits)


def test_finds_founder_for_about_query():
    retriever = TfidfRetriever()
    hits = retriever.search("Who founded Krish AI Labs?")
    assert hits
    assert any(h.chunk.source == "about.md" for h in hits)


def test_finds_contact_info_for_pricing_query():
    retriever = TfidfRetriever()
    hits = retriever.search("How much does it cost to get a quote?")
    assert hits
    sources = {h.chunk.source for h in hits}
    assert "contact.md" in sources or "home.md" in sources


def test_irrelevant_query_returns_no_or_low_confidence_matches():
    retriever = TfidfRetriever()
    hits = retriever.search("xyzzy quantum banana nonsense")
    assert hits == []


def test_results_are_sorted_by_score_descending():
    retriever = TfidfRetriever()
    hits = retriever.search("full-stack software development services")
    scores = [h.score for h in hits]
    assert scores == sorted(scores, reverse=True)
