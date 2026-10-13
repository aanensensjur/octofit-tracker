import CollectionPage from './CollectionPage'

function Workouts() {
  return (
    <CollectionPage
      description="Explore workouts for a range of fitness levels."
      endpoint="/api/workouts/"
      title="Workouts"
    />
  )
}

export default Workouts
