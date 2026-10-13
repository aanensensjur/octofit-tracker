import CollectionPage from './CollectionPage'

function Leaderboard() {
  return (
    <CollectionPage
      description="See how members are progressing this week."
      endpoint="/api/leaderboard/"
      request={fetch}
      title="Leaderboard"
    />
  )
}

export default Leaderboard
