function Message({ message }: { message: string }) {
  return (
    <p className="text-center text-sm text-muted-foreground w-[80%] mx-auto my-8 font-medium">
      {message}
    </p>
  );
}

export default Message;
