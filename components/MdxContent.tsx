"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMDXComponents } from "@/mdx-components";

interface MdxContentProps {
  source: MDXRemoteSerializeResult;
}

export default function MdxContent({ source }: MdxContentProps) {
  const components = useMDXComponents();
  return <MDXRemote {...source} components={components} />;
}
