/**
 * REQ-002's other half: the message has to be somewhere the user cannot miss.
 *
 * `role="alert"` so a screen reader announces it when it appears, which is the
 * whole point of the requirement — an error that is surfaced, not swallowed.
 */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <p role="alert" data-testid="error-banner">
      {message}
    </p>
  );
}
