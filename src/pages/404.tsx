import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loader } from "~/components/Loader";

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      void router.push('/');
    }, 3000)
  }, [router]);

  return (
    <section className="text-center mt-28">
      <h1 className="font-display font-medium text-4xl sm:text-6xl mb-3">
        404
      </h1>
      <p className="text-lg sm:text-2xl mb-12">
        {`You're trying to access a non-existent page`}
      </p>
      <p className="font-light sm:text-lg">
        Redirecting to home page...
      </p>
      <div className="relative mt-10 w-12 m-auto">
        <Loader />
      </div>
    </section>
  );
};

export default ErrorPage;
