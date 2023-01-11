export const implementsAns110Tag = { name: 'Implements', value: 'ANS-110' }
export const ans110ImageTag = { name: 'Type', value: 'image' }
export const ans110MusicTag = { name: 'Type', value: 'music' }
export const ans110ProfileTag = { name: 'Type', value: 'profile' }
export const ans110ModelTag = { name: 'Type', value: 'model' }

export function ans110TitleTag(title: string) {
  return { name: 'Title', value: title }
}

export function ans110TopicTag(topic: string) {
  return { name: 'Topic', value: topic }
}

export const ANS_110_DESCRIPTION_LIMIT = 300
export function ans110DescriptionTag(description: string) {
  return {
    name: 'Description',
    value: description.substring(0, ANS_110_DESCRIPTION_LIMIT)
  }
}

function buildTags(
  type: string,
  title: string,
  topic: string = 'Art',
  description?: string
) {
  const tags = [
    implementsAns110Tag,
    ans110TitleTag(title),
    ans110TopicTag(topic)
  ]

  if (description) {
    tags.push(ans110DescriptionTag(description))
  }

  switch (type) {
    case 'image':
      tags.push(ans110ImageTag)
      break
    case 'music':
      tags.push(ans110MusicTag)
      break
    case 'profile':
      tags.push(ans110ProfileTag)
      break
    case 'model':
      tags.push(ans110ModelTag)
      break
  }

  return tags
}

type Ans110HelperOpts = {
  title: string
  topic?: string
  description?: string
}
export const ans110 = {
  tags: {
    image: ({
      title,
      topic,
      description
    }: Ans110HelperOpts) => buildTags('image', title, topic, description),
    music: ({
      title,
      topic,
      description
    }: Ans110HelperOpts) => buildTags('music', title, topic, description),
    profile: ({
      title,
      topic,
      description
    }: Ans110HelperOpts) => buildTags('profile', title, topic, description),
    model: ({
      title,
      topic,
      description
    }: Ans110HelperOpts) => buildTags('model', title, topic, description)
  }
}
