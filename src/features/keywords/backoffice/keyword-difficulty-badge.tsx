function difficultyPresentation(score: number) {
  if (score <= 14) return { label: "Very easy", className: "badge-success" };
  if (score <= 29) return { label: "Easy", className: "badge-success" };
  if (score <= 49) return { label: "Possible", className: "badge-info" };
  if (score <= 69) return { label: "Difficult", className: "badge-warning" };
  if (score <= 84) return { label: "Hard", className: "badge-error" };
  return { label: "Very hard", className: "badge-error" };
}

export function KeywordDifficultyBadge({ score }: { score: number | null }) {
  if (score === null) return <>—</>;
  const presentation = difficultyPresentation(score);
  return (
    <span
      className={`badge badge-sm ${presentation.className}`}
      title={`Keyword difficulty: ${score} (${presentation.label})`}
    >
      {score} · {presentation.label}
    </span>
  );
}
