require 'json'

class LevelsController < ApplicationController
  $positions = [8, 35, 23]
  $rotations = [2, 0, 3]
  $end_positions = [53, 24, 1]
  $code = ""
  $is_run = false

  def main

  end

  def levels

  end

  def level1

  end

  def run_line

  end

  def run_program
    unless $is_run
      $is_run = true
      $code = params[:code].split(/\r?\n/)
      isMistakes = false
      $code.each do |line|
        if line != "abc"
          isMistakes = true
        end
      end
      if isMistakes
        render json: false
      else
        render json: true
      end
      $is_run = false
    end
  end

  def update_level
    i = 1
    info = [$positions[i], $rotations[i], $end_positions[i]]
    render json: info
  end
end
