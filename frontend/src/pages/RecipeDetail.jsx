// Recipe Detail page
import { useParams } from 'react-router-dom';
import RecipeDetailView from '../components/RecipeDetailView';

export default function RecipeDetail() {
  const { id } = useParams();
  return <RecipeDetailView id={id} />;
}
