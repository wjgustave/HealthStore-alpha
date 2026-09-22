import { notFound } from 'next/navigation'
import TaskQuestionPage from '@/components/supplier-onboard/TaskQuestionPage'
import TaskStubPage from '@/components/supplier-onboard/TaskStubPage'
import { ALL_TASKS, SERVICE_NAME, findTask } from '@/lib/supplierOnboarding'

type Params = Promise<{ task: string }>

export function generateStaticParams() {
  return ALL_TASKS.map((t) => ({ task: t.slug }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const { task: slug } = await params
  const match = findTask(slug)
  if (!match) return { title: `${SERVICE_NAME} — NHS HealthStore` }
  return { title: `${match.task.title} — ${SERVICE_NAME}` }
}

/** First question of a task (later questions live at /supplier-onboard/[task]/[step]). */
export default async function SupplierOnboardTaskPage({ params }: { params: Params }) {
  const { task: slug } = await params
  const match = findTask(slug)
  if (!match) notFound()
  if (match.task.questions.length === 0) {
    return <TaskStubPage task={match.task} section={match.section} />
  }
  return <TaskQuestionPage task={match.task} step={1} />
}
