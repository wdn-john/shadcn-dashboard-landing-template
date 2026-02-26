export function Logo() {
  return (
    <>
      <img
        src="/logo/logo-black.svg"
        alt="Workedin"
        className="hidden h-auto w-auto dark:hidden sm:inline"
        style={{ maxHeight: "1.5rem" }}
      />
      <img
        src="/logo/logo-light.svg"
        alt="Workedin"
        className="hidden h-auto w-auto sm:dark:inline"
        style={{ maxHeight: "1.5rem" }}
      />
    </>
  )
}
