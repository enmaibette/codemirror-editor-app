import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useChallengeStore } from '@/stores/challengeStore';
import { useRunCode } from '@/hooks/useRunCode';

export function Header() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const challenges = useChallengeStore((state) => state.challenges);
  const { triggerRun } = useRunCode();

  const isChallengePage = location.pathname.startsWith('/challenge/');
  const challengeLabel =
    id && isChallengePage
      ? challenges.find((challenge) => challenge.id === id)?.title ?? `Challenge ${id}`
      : null;

  return (
    <header
      className="
        flex items-center justify-between
        px-4 h-12 shrink-0
        bg-[var(--surface)]
        border-b border-[var(--border)]
        z-10
      "
    >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link
                to="/"
                className="text-[var(--accent)] font-semibold text-sm tracking-wide select-none hover:opacity-90"
              >
                {'</>'} Python OOP
              </Link>
            </BreadcrumbItem>
            {isChallengePage && challengeLabel && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm">{challengeLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      {isChallengePage && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={triggerRun}>
            Run
          </Button>
          <Button variant="default" size="sm">
            Submit
          </Button>
        </div>
      )}
    </header>
  );
}
