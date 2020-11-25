import React from "react"
import * as styles from "./container.module.scss"

interface ContainerProps {
  children: JSX.Element
}

export default function Container(props: ContainerProps) {
  return <div className={styles.Container}>{props.children}</div>
}
