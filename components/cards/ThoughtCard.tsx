import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { calculateRelativeTimes } from '@/lib/utils';
import { fetchUser } from '@/lib/actions/user.actions';
import LikeButton from '../shared/LikeButton';
import { currentUser } from '@clerk/nextjs';
import EditComment from '../forms/EditComment';
import ThoughtCardMenu from '../shared/ThoughtCardMenu';
import SharePopover from '../shared/SharePopover';

type Props = {
  thoughtId: string;
  currentUserId_clerk: string | null;
  thought: string;
  image: string;
  author: {
    name: string;
    image: string;
    _id: string;
    idUser_clerk: string;
    username: string;
  };
  createdAt: Date;
  comments: Array<{
    author: {
      image: string;
    };
  }>;
  isComment?: boolean;
  likes: any;
  archived: boolean;
};

export default async function ThoughtCard({
  thoughtId,
  currentUserId_clerk,
  thought,
  image,
  author,
  createdAt,
  comments,
  isComment,
  likes,
  archived,
}: Props) {
  const createdWhen = calculateRelativeTimes(createdAt);

  let currentUser_db: any = null;
  if (currentUserId_clerk) {
    currentUser_db = await fetchUser(currentUserId_clerk);
  }

  let likedByCurrentUser: number = -1;
  if (currentUser_db) {
    const liked = likes.find((l: any) => {
      if (l.user._id.equals(currentUser_db._id)) {
        return l;
      } else {
        return null;
      }
    });
    likedByCurrentUser = liked ? 1 : 0;
  }

  return (
    <article
      className={`flex w-full flex-col rounded-lg ${
        isComment ? 'p-0 xs:px-7' : 'bg-dark-2 p-5 md:p-7'
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link
              href={`/profile/${author.idUser_clerk}`}
              className='relative h-11 w-11'
            >
              <Image
                src={author.image}
                alt={`Profile image of ${author.name}`}
                fill
                sizes='normal'
                className='cursor-pointer rounded-full'
              />
            </Link>
            <div className='thought-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-3'>
                <Link
                  href={`/profile/${author.idUser_clerk}`}
                  className='w-fit'
                >
                  <h4 className='cursor-pointer text-base-semibold text-light-1'>
                    {author.name}
                  </h4>
                </Link>
                <p className='text-gray-1 text-small-regular'>{createdWhen}</p>
              </div>
              {!isComment && (
                <>
                  {JSON.stringify(author._id) ===
                    JSON.stringify(currentUser_db?._id || '') && (
                    <ThoughtCardMenu
                      thoughtId={JSON.stringify(thoughtId)}
                      archived={archived}
                    />
                  )}
                </>
              )}
            </div>

            {isComment ? (
              <EditComment
                thoughtId={JSON.stringify(thoughtId)}
                thought={thought}
                image={image}
                authorId={JSON.stringify(author._id)}
                currentUserId_db={JSON.stringify(currentUser_db._id)}
              />
            ) : (
              <div>
                <p className='text-light-2 mt-2 text-small-regular text-start mb-2 pr-4'>
                  {thought}
                </p>
                {image.length > 0 && (
                  <Image
                    className='border border-dark-4 rounded-md'
                    src={image}
                    alt='thought image'
                    width={500}
                    height={500}
                    priority
                  />
                )}
              </div>
            )}
            <div className='mt-4 flex flex-col gap-2'>
              <div className='flex flex-row items-start gap-3.5'>
                <LikeButton
                  likedByCurrentUser={likedByCurrentUser}
                  currentUserId_db={
                    currentUser_db ? JSON.stringify(currentUser_db._id) : null
                  }
                  thoughtId={JSON.stringify(thoughtId)}
                />
                <Link href={`/thought/${thoughtId}`}>
                  <Image
                    src='/assets/reply.svg'
                    height={24}
                    width={24}
                    alt='icon-reply'
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <Link href={`/thought/re-post/${thoughtId}`}>
                  <Image
                    src='/assets/repost.svg'
                    height={24}
                    width={24}
                    alt='icon-repost'
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <SharePopover
                  thoughtId={JSON.stringify(thoughtId)}
                  thought={thought}
                  thoughtImage={image}
                />
              </div>
              <div
                className={`flex flex-row gap-3 ${
                  isComment && (comments.length > 0 || likes.length > 0)
                    ? 'mb-6'
                    : 'mb-2'
                }`}
              >
                {comments.length > 0 && (
                  <Link href={`/thought/${thoughtId}`}>
                    <p className='text-subtle-medium text-gray-1'>
                      {comments.length}{' '}
                      {comments.length > 1 ? 'replies' : 'reply'}
                    </p>
                  </Link>
                )}
                {comments.length > 0 && likes.length > 0 && (
                  <span className='text-subtle-medium text-gray-1'>
                    &middot;
                  </span>
                )}
                {likes.length > 0 && (
                  <p className='text-subtle-medium text-gray-1'>
                    {likes.length} {likes.length > 1 ? 'likes' : 'like'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
