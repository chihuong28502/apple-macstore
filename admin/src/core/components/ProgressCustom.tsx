import styles from "./ProgressCustom.module.css"; // Import module CSS

function ProgressCustom() {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}></div>
    </div>
  );
}

export default ProgressCustom;
