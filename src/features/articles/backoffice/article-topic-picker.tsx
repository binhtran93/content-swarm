"use client";

import { useMemo, useState } from "react";

function sameTopic(left: string, right: string) {
  return left.localeCompare(right, undefined, { sensitivity: "accent" }) === 0;
}

export function ArticleTopicPicker({
  initialTopics,
  options,
}: {
  initialTopics: string[];
  options: string[];
}) {
  const [topics, setTopics] = useState(initialTopics);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const suggestions = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();

    return options.filter(
      (option) =>
        !topics.some((topic) => sameTopic(topic, option)) &&
        (!search || option.toLocaleLowerCase().includes(search)),
    );
  }, [options, query, topics]);

  function addTopic(value: string) {
    const topic = value.trim();

    if (!topic || topics.some((item) => sameTopic(item, topic))) {
      setQuery("");
      return;
    }

    setTopics((current) => [...current, topic]);
    setQuery("");
  }

  return (
    <fieldset
      className="fieldset min-w-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <span className="fieldset-legend">Topics</span>
      <div className="relative">
        <div className="border-base-300 focus-within:border-base-content flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-2 py-1.5">
          {topics.map((topic) => (
            <span className="badge badge-ghost gap-1" key={topic}>
              {topic}
              <button
                aria-label={`Remove ${topic}`}
                className="cursor-pointer text-base leading-none opacity-60 hover:opacity-100"
                onClick={() =>
                  setTopics((current) =>
                    current.filter((item) => !sameTopic(item, topic)),
                  )
                }
                type="button"
              >
                ×
              </button>
              <input name="topics" type="hidden" value={topic} />
            </span>
          ))}
          <input
            aria-label="Add topic"
            autoComplete="off"
            className="min-w-32 flex-1 border-0 bg-transparent px-1 py-1 outline-none"
            maxLength={80}
            name="topics"
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addTopic(query);
              } else if (event.key === "Backspace" && !query && topics.length) {
                setTopics((current) => current.slice(0, -1));
              }
            }}
            placeholder={
              topics.length ? "Add another…" : "Choose or enter topics…"
            }
            value={query}
          />
        </div>
        {focused && suggestions.length ? (
          <ul className="menu border-base-300 bg-base-100 absolute z-20 mt-1 max-h-52 w-full flex-nowrap overflow-y-auto rounded-md border p-1 shadow-lg">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button onClick={() => addTopic(suggestion)} type="button">
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <span className="text-base-content/55 mt-1 text-xs">
        Select configured topics or type a new one. Press Enter or comma to add.
      </span>
    </fieldset>
  );
}
