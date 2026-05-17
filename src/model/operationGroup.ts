import type Operation from "./operation"

export default interface OperationGroup {
  title: string
  items: Operation[]
}