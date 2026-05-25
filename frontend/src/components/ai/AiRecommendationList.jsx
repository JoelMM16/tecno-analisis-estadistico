export default function AiRecommendationList({ items = [] }) {
  return <ul className="clean-list recommendation-list">{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
}
