export default function PageContainer({ title, subtitle, children, actions }) {
  return <main className="page"><div className="page-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{actions}</div>{children}</main>;
}
