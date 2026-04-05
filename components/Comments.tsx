"use client";

import Giscus from "@giscus/react";
import { components } from "./Typography";

const { h3: H3 } = components;

export function Comments() {
  return (
    <div>
      <H3 className="mb-7">Comments</H3>
      <Giscus
        repo="jdonghia/jdonghia.github.io"
        repoId="R_kgDORyuLjg"
        category="General"
        categoryId="DIC_kwDORyuLjs4C6IIZ"
        mapping="pathname"
        strict="0"
        reactionsEnabled="0"
        emitMetadata="0"
        inputPosition="bottom"
        theme="transparent_dark"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
