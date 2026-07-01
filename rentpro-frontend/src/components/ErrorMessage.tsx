interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return <p className="error">{message}</p>;
}
