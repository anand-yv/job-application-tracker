import styles from "./NotFound.module.css"

const NotFound = () => {
    return <div className={styles["container"]}>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
}

export default NotFound;