import { createElement, type ComponentType, type ReactNode } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

type IconNode = {
  tag: string;
  attr: Record<string, string>;
  child: IconNode[];
};

type IconProps = {
  attr?: Record<string, string>;
  size?: string | number;
  color?: string;
  title?: string;
  children?: ReactNode;
};

const tags: Record<string, ComponentType<any>> = {
  circle: Circle,
  ellipse: Ellipse,
  g: G,
  line: Line,
  path: Path,
  polygon: Polygon,
  polyline: Polyline,
  rect: Rect,
};

function paint(attr: Record<string, string>, color: string): Record<string, string> {
  const next = { ...attr };
  if (!next.fill || next.fill === 'currentColor') next.fill = next.fill === 'currentColor' ? color : 'none';
  if (next.stroke === 'currentColor' || (!next.stroke && next.fill === 'none')) next.stroke = color;
  return next;
}

function Tree({ nodes, color }: { nodes: IconNode[]; color: string }) {
  return nodes.map((node, index) => {
    const Tag = tags[node.tag];
    if (!Tag) return null;
    return createElement(
      Tag,
      { key: index, ...paint(node.attr, color) },
      node.child?.length ? <Tree nodes={node.child} color={color} /> : undefined,
    );
  });
}

export function GenIcon(data: IconNode) {
  return function Icon(props: IconProps) {
    return <IconBase attr={data.attr} {...props}>{<Tree nodes={data.child} color={props.color || '#111111'} />}</IconBase>;
  };
}

export function IconBase(props: IconProps) {
  const size = Number(props.size) || 24;
  const color = props.color || '#111111';
  const attr = props.attr ?? {};
  return (
    <Svg
      width={size}
      height={size}
      viewBox={attr.viewBox || '0 0 24 24'}
      fill="none"
      stroke={color}
      strokeWidth={attr.strokeWidth || 0}
      strokeLinecap={attr.strokeLinecap as 'round' | 'butt' | 'square' | undefined}
      strokeLinejoin={attr.strokeLinejoin as 'round' | 'miter' | 'bevel' | undefined}
    >
      {props.children}
    </Svg>
  );
}
