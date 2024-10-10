import * as React from 'react';
import { useSession } from 'next-auth/react';
import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import { PageBreadcrumb } from '@patternfly/react-core/dist/dynamic/components/Page';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateActions } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import GithubIcon from '@patternfly/react-icons/dist/esm/icons/github-icon';
import Image from 'next/image';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { useRouter } from 'next/navigation';
import { fetchPullRequests, getGitHubUsername } from '../../utils/github';
import { PullRequest } from '../../types';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core/dist/esm/components/Breadcrumb';
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { Popover } from '@patternfly/react-core/dist/esm/components/Popover';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { Modal, ModalVariant } from '@patternfly/react-core/dist/esm/components/Modal/Modal';
import { useState } from 'react';
import { Spinner } from '@patternfly/react-core/dist/esm/components/Spinner';

import { TableSortableResponsive } from './PrTable';

const mockPR: PullRequest[] = [
  {
    number: 0,
    title: 'test0',
    user: {
      login: 'test0'
    },
    html_url: 'http://test.com/',
    state: 'open',
    created_at: '2024-10-09',
    updated_at: '2024-10-09',
    labels: [{ name: 'test' }]
  },
  {
    number: 1,
    title: 'test1',
    user: {
      login: 'test1'
    },
    html_url: 'http://test.com/',
    state: 'open',
    created_at: '2024-10-10',
    updated_at: '2024-10-10',
    labels: [{ name: 'test' }, { name: 'hello' }, { name: 'world' }]
  }
];

const Index: React.FunctionComponent = () => {
  const { data: session } = useSession();
  const [pullRequests, setPullRequests] = React.useState<PullRequest[]>(mockPR);
  // const [isFirstPullDone, setIsFirstPullDone] = React.useState<boolean>(true);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  //  interface PullRequest {
  //   number: number;
  //   title: string;
  //   user: {
  //     login: string;
  //   };
  //   html_url: string;
  //   state: string;
  //   created_at: string;
  //   updated_at: string;
  //   labels: Label[];
  // }

  // const fetchAndSetPullRequests = () => {
  // setIsFirstPullDone(true);
  // setIsLoading(false);

  // const fetchAndSetPullRequests = React.useCallback(async () => {
  //   if (session?.accessToken) {
  //     try {
  //       const header = {
  //         Authorization: `Bearer ${session.accessToken}`,
  //         Accept: 'application/vnd.github.v3+json'
  //       };
  //       const fetchedUsername = await getGitHubUsername(header);
  //       const data = await fetchPullRequests(session.accessToken);
  //       const filteredPRs = data.filter(
  //         (pr: PullRequest) => pr.user.login === fetchedUsername && pr.labels.some((label) => label.name === 'skill' || label.name === 'knowledge')
  //       );

  //       // Sort by date (newest first)
  //       const sortedPRs = filteredPRs.sort((a: PullRequest, b: PullRequest) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  //       setPullRequests(sortedPRs);
  //     } catch (error) {
  //       console.log('Failed to fetch pull requests.' + error);
  //     }
  //     setIsFirstPullDone(true);
  //     setIsLoading(false);
  //   }
  // }, [session?.accessToken]);

  // React.useEffect(() => {
  //   fetchAndSetPullRequests();
  //   const intervalId = setInterval(fetchAndSetPullRequests, 60000);
  //   return () => clearInterval(intervalId);
  // }, [session, fetchAndSetPullRequests]);

  const handleEditClick = (pr: PullRequest) => {
    const hasKnowledgeLabel = pr.labels.some((label) => label.name === 'knowledge');
    const hasSkillLabel = pr.labels.some((label) => label.name === 'skill');

    if (hasKnowledgeLabel) {
      router.push(`/edit-submission/knowledge/${pr.number}`);
    } else if (hasSkillLabel) {
      router.push(`/edit-submission/skill/${pr.number}`);
    }
  };

  const handleOnClose = () => {
    setIsLoading(false);
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem to="/"> Dashboard </BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>
      <PageSection style={{ backgroundColor: 'white' }}>
        <Title headingLevel="h1" size="lg">
          My Submissions
        </Title>
        <TextContent>
          View and manage your taxonomy contributions.
          <Popover
            aria-label="Basic popover"
            bodyContent={
              <div>
                Taxonomy contributions help tune the InstructLab model. Contributions can include skills that teach the model how to do something or
                knowledge that teaches the model facts, data, or references.{' '}
                <a href="https://docs.instructlab.ai" target="_blank" rel="noopener noreferrer">
                  Learn more<ExternalLinkAltIcon style={{ padding: '3px' }}></ExternalLinkAltIcon>
                </a>
              </div>
            }
          >
            <OutlinedQuestionCircleIcon />
          </Popover>
        </TextContent>
      </PageSection>
      <PageSection>
        <div style={{ marginBottom: '20px' }} />
        <TableSortableResponsive />
        {/* {!isFirstPullDone && (
          <Modal variant={ModalVariant.small} title="Retrieving your submissions" isOpen={isLoading} onClose={() => handleOnClose()}>
            <div>
              <Spinner size="md" />
              Retrieving all your skills and knowledge submissions from taxonomy repository.
            </div>
          </Modal>
        )} */}
        {pullRequests.length === 0 ? (
          <EmptyState>
            <EmptyStateHeader
              titleText="Welcome to InstructLab"
              headingLevel="h4"
              icon={
                <div>
                  <Image src="/InstructLab-LogoFile-RGB-FullColor.svg" alt="InstructLab Logo" width={256} height={256} />
                </div>
              }
            />
            <EmptyStateBody>
              <div style={{ maxWidth: '60ch' }}>
                InstructLab is a powerful and accessible tool for advancing generative AI through community collaboration and open-source principles.
                By contributing your own data, you can help train and refine the language model. <br />
                <br />
                To get started, contribute a skill or contribute knowledge.
              </div>
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="primary" onClick={() => router.push('/contribute/skill')}>
                  Contribute Skill
                </Button>
                <Button variant="primary" onClick={() => router.push('/contribute/knowledge')}>
                  Contribute Knowledge
                </Button>
                <Button variant="primary" onClick={() => router.push('/playground/chat')}>
                  Chat with the Models
                </Button>
              </EmptyStateActions>
              <EmptyStateActions>
                <Button
                  variant="link"
                  icon={<GithubIcon />}
                  iconPosition="right"
                  component="a"
                  href="https://github.com/instructlab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the Project on Github
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        ) : (
          <Stack hasGutter>
            {mockPR.map((pr) => (
              <StackItem key={pr.number}>
                <Card>
                  <CardTitle>{pr.title}</CardTitle>
                  <CardBody>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                      <FlexItem>State: {pr.state}</FlexItem>
                      <FlexItem>Created At: {new Date(pr.created_at).toLocaleString()}</FlexItem>
                      <FlexItem>Updated At: {new Date(pr.updated_at).toLocaleString()}</FlexItem>
                      <FlexItem>
                        {pr.labels.map((label) => (
                          <Label key={label.name} color="blue" style={{ marginRight: '5px' }}>
                            {label.name}
                          </Label>
                        ))}
                      </FlexItem>
                      <FlexItem alignSelf={{ default: 'alignSelfFlexEnd' }} flex={{ default: 'flexNone' }}>
                        <Button variant="secondary" component="a" href={pr.html_url} target="_blank" rel="noopener noreferrer">
                          View PR
                        </Button>
                      </FlexItem>
                      <FlexItem alignSelf={{ default: 'alignSelfFlexEnd' }} flex={{ default: 'flexNone' }}>
                        {pr.state === 'open' && (
                          <Button variant="primary" onClick={() => handleEditClick(pr)}>
                            Edit
                          </Button>
                        )}
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </StackItem>
            ))}
          </Stack>
        )}
      </PageSection>
    </div>
  );
};

export { Index };
