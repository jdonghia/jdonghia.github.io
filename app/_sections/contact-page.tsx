import { Copyright } from "@/components/Copyright";

export function ContactPage() {
  return (
    <div className="border-gray-200 dark:border-gray-700 pt-6 pb-14">
      <p className="pb-6 text-center text-sm text-gray-600 dark:text-gray-400 leading-7">
        Reach me directly at{" "}
        <a href="mailto:joao@jdonghia.me" className="text-light-sea-green hover:underline">
          joao.donghia@gmail.com
        </a>
      </p>
      <Copyright />
    </div>
  );
}
