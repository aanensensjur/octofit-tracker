import CollectionPage from './CollectionPage'

function Teams() {
  return (
    <CollectionPage
      description="Meet the teams and their members."
      endpoint="/api/teams/"
      request={fetch}
      title="Teams"
    />
  )
}

export default Teams
