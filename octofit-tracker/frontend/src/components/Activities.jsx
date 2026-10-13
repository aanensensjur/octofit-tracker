import CollectionPage from './CollectionPage'

function Activities() {
  return (
    <CollectionPage
      description="Review your recent workouts and recorded activity."
      endpoint="/api/activities/"
      request={fetch}
      title="Activities"
    />
  )
}

export default Activities
